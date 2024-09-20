import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, merge, of } from 'rxjs';
import { catchError, finalize, switchMap, take, tap } from 'rxjs/operators';
import { ColumnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import { MyLeaveRequest } from '../../../core/models/interfaces/myLeaveRequest';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { DynamictableComponent } from '../../../shared/reusable/dynamictable/dynamictable.component';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [DynamictableComponent, CommonModule],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
})
export class LeaveRequestComponent implements OnInit, OnDestroy {
  @ViewChild('buttonRef') buttonRef!: TemplateRef<any>;

  columnMetaData: ColumnMetaDataType[] = [];
  leaveData: MyLeaveRequest[] = [];
  isLoading: boolean = false;

  private subscriptions = new Subscription();

  constructor(
    private userService: CurrentUserService,
    private leaveService: LeaveService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeColumnMetaData();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Clean up all subscriptions
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
        tooltip: true,
      },
    ];
  }

  private setupSubscriptions(): void {
    // Observable to handle leave request creation event to refresh leave requests on creation of leave request
    const leaveRequestCreated$ = this.leaveService.leaveRequestCreated$.pipe(
      tap((data) => {
        if (data) {
          this.fetchLeaveRequests();
        }
      })
    );

    //fetching the leave requests when the user changes
    const userChanges$ = this.userService.currentUser$.pipe(
      tap((user) => {
        if (!user) {
          this.toastr.error('Please choose a user to fetch leave request data');
        }
      }),
      switchMap((user) => (user ? this.fetchLeaveRequests() : of([])))
    );

    // Combine user changes and leave request creation observables for easy cleanup
    this.subscriptions.add(
      merge(userChanges$, leaveRequestCreated$)
        .pipe(catchError(() => of([]))) // Handle any errors
        .subscribe()
    );
  }

  private fetchLeaveRequests() {
    this.isLoading = true; // Start loading

    return this.userService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          return this.leaveService
            .getLeaveRequestsByEmployeeId(user.id)
            .pipe(take(1));
        } else {
          this.leaveData = []; // Reset leave data if no user is found
          this.toastr.error('Please choose a user to fetch leave request data');
          return of([]);
        }
      }),
      tap((leaveData: MyLeaveRequest[]) => {
        this.leaveData = leaveData;
      }),
      catchError(() => {
        this.leaveData = []; // Reset leave data on error
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false; // Stop loading on completion or error
      })
    );
  }
}
