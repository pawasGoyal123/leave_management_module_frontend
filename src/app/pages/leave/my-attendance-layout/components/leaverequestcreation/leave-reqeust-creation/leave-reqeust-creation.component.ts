import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { MatIconModule } from '@angular/material/icon';
import { LeaveService } from '../../../../../../core/services/leave/leave.service';
import { User } from '../../../../../../core/models/interfaces/User';
import { CurrentUserService } from '../../../../../../core/services/user/current-user-service.service';
import { delay, take, tap } from 'rxjs';
import { LeaveType } from '../../../../../../core/models/interfaces/leaveType';
import { SelectInputOption } from '../../../../../../core/models/interfaces/selectOptionType';
import { LeaveRequestCreationData } from '../../../../../../core/models/interfaces/leaveRequestCreationData';

type DialogData = {
  message: string;
};

export function dateRangeValidator(fromDateKey: string, toDateKey: string): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const fromDate: Date | null = formGroup.get(fromDateKey)?.value;
    const toDate: Date | null = formGroup.get(toDateKey)?.value;

    if (fromDate && toDate && toDate < fromDate) {
      return { dateRangeInvalid: true };
    }

    return null;
  };
}

function dateToISOLikeButLocal(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal = date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 19);
  return isoLocal;
}

@Component({
  selector: 'app-leave-request-creation',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDialogModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, CdkTextareaAutosize, MatDatepickerModule, ReactiveFormsModule, CommonModule, MatSelectModule, DropdownModule, MatIconModule],
  templateUrl:'./leave-reqeust-creation.component.html',
  styleUrl:'./leave-reqeust-creation.component.scss',
})
export class LeaveRequestCreationComponent implements OnInit {
  leaveRequestCreationForm!: FormGroup;
  leaveTypes: LeaveType[] = [];
  dialogLoading = false;
  currentUser: User | null = null;
  leaveDurationData: SelectInputOption<string>[] = [
    {
      label: 'Full Day',
      value: 'Full Day'
    },
    {
      label: 'Half Day',
      value: 'Half Day'
    }
  ];
  leaveHalfData: SelectInputOption<string>[] = [
    {
      label: 'First Half',
      value: 'First Half'
    },
    {
      label: 'Second Half',
      value: 'Second Half'
    }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private leaveService: LeaveService,
    private dialogRef: MatDialogRef<LeaveRequestCreationComponent>,
    private userService: CurrentUserService
  ) {}

  ngOnInit(): void {
    this.leaveRequestCreationForm = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      duration: [null, Validators.required],
      leaveHalf: [null],
      leaveTypeName: [null, Validators.required],
      reason: [null, [Validators.maxLength(500)]]
    }, { validators: dateRangeValidator('fromDate', 'toDate') });

    this.leaveService.getLeaveTypes().subscribe(
      (data: LeaveType[]) => {
        this.leaveTypes = data;
      }
    );

    this.userService.currentUser$.pipe(take(1)).subscribe(
      (data: User | null) => {
        this.currentUser = data;
      }
    );
  }

  clearControl(controlName: string): void {
    this.leaveRequestCreationForm.get(controlName)?.reset();
  }

  sendData(): void {
    if (this.leaveRequestCreationForm.valid) {
      const data = this.leaveRequestCreationForm.value;
      const obj: LeaveRequestCreationData = {
        fromDate: dateToISOLikeButLocal(data.fromDate),
        toDate: dateToISOLikeButLocal(data.toDate),
        duration: data.duration,
        firstHalf: data.duration !== 'Full Day' ? data.leaveHalf === 'First Half' || !data.leaveHalf : true,
        secondHalf: data.duration !== 'Full Day' ? data.leaveHalf === 'Second Half' : true,
        leaveTypeName: data.leaveTypeName,
        reason: data.reason
      };

      this.dialogLoading = true;
      if (this.currentUser) {
        this.leaveService.createLeaveRequest(obj, this.currentUser.id).pipe(
          delay(1000),
          tap(() => this.dialogLoading = false)
        ).subscribe({
          next: () => {
            this.dialogRef.close({created:'true'});
          },
          error: () => {
            this.dialogLoading=false;
          },
          complete: () => {
            this.dialogLoading = false;
          }
        });
      } else {
        this.dialogLoading = false;
      }
    }
  }
}
