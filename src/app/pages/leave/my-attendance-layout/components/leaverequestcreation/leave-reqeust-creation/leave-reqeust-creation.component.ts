import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { CommonModule } from '@angular/common';

type DialogData={
  message:string;
}

export function dateRangeValidator(startDateKey: string, toDateKey: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
      const startDate: Date | null = control.get(startDateKey)?.value;
      const toDate: Date | null = control.get(toDateKey)?.value;
      if (startDate && toDate && toDate< startDate) {
          return { dateRangeInvalid: true };
      }

      return null;
  };
}

@Component({
  selector: 'app-leave-reqeust-creation',
  standalone: true,
  providers:[provideNativeDateAdapter()],
  imports: [MatDialogModule,MatFormFieldModule,FormsModule,MatButtonModule,MatInputModule,CdkTextareaAutosize, MatDatepickerModule,ReactiveFormsModule,CommonModule],
  templateUrl: './leave-reqeust-creation.component.html',
  styleUrl: './leave-reqeust-creation.component.scss',
})
export class LeaveReqeustCreationComponent implements OnInit {
  name:string='';
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private formBuilder:FormBuilder){};
  leaveRequestCreationForm!:FormGroup;
  ngOnInit(): void {
      this.leaveRequestCreationForm=this.formBuilder.group({
        fromDate:[null,Validators.required],
        toDate:[null,[Validators.required]],
        leaveDuration:[null,[Validators.required]],
        leaveType:[null,Validators.required],
        leaveReason:[null,[Validators.max(500)]]
      },{validators:dateRangeValidator('fromDate', 'toDate')})
  }

  

}
