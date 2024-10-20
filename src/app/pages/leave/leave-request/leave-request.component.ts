import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { delay, switchMap, take, tap } from 'rxjs/operators';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { DynamictableComponent } from '../../../shared/reusable/dynamictable/dynamictable.component';
import { CommonModule } from '@angular/common';
import { ColumnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import { MyLeaveRequest } from '../../../core/models/interfaces/myLeaveRequest';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [DynamictableComponent, CommonModule],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
})
export class LeaveRequestComponent {
  @ViewChild('buttonRef') buttonRef!: TemplateRef<any>;
  columnMetaData: ColumnMetaDataType[] = [];
  leaveData: MyLeaveRequest[] = [];
  isLoading: boolean = false;

  private userSubscription!: Subscription;

  constructor(
    private userService: CurrentUserService,
    private leaveService: LeaveService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.initializeColumnMetaData();
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.currentUser$
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.leaveData = [];
        }),
        switchMap((user) => {
          if (user) {
            return this.leaveService
              .getLeaveRequestsByEmployeeId(user.id)
              .pipe(
                delay(1000),
                tap(() => (this.isLoading = false)),take(1));
          } else {
            this.isLoading = false;
            return [];
          }
        })
      )
      .subscribe({
        next: (leaveData: MyLeaveRequest[]) => (this.leaveData = leaveData),
        error: () => {
          this.leaveData = [];
          this.isLoading = false;
        },
      });

    this.leaveService.leaveRequestCreated$.subscribe((data) => {
      if(data){
      this.refreshData();}
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  private initializeColumnMetaData() {
    this.columnMetaData = [
      {
        columnName: 'duration',
        label: 'Duration Requested',
        type: 'date',
        typeArgs: ['dd-MMM-yyyy'],
        combineData: ['fromDate', 'toDate'],
        combineSeprator: ' - ',
        commonColumnClass: ['flex-grow', 'start'],
      },
      {
        columnName: 'firstHalf',
        label: 'First Half',
        type: 'boolean',
      },
      {
        columnName: 'secondHalf',
        label: 'Second Half',
        type: 'boolean',
      },
      {
        columnName: 'status',
        label: 'Status',
        type: 'status',
      },
      {
        columnName: 'managerComment',
        label: 'Manager Comment',
        commonColumnClass: ['overflow-content'],
        rowColumnClass: [],
        tooltip: true,
      },
    ];
    this.cd.detectChanges();
  }

  private refreshData() {
    this.isLoading = true;
    this.leaveData = [];
    this.userService.currentUser$
      .pipe(
        take(1),
        switchMap((user) => {
          if (user) {
            return this.leaveService
              .getLeaveRequestsByEmployeeId(user.id)
              .pipe(
                delay(1000),
                tap(() => (this.isLoading = false)), take(1));
          }
          this.isLoading = false;
          return [];
        })
      )
      .subscribe({
        next: (leaveData: MyLeaveRequest[]) => {
          this.leaveData = leaveData;
        },
        error: () => {
          this.leaveData = [];
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}