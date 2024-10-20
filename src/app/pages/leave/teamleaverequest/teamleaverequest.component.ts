import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {
  StatusType,
  TeamLeaveRequest,
} from '../../../core/models/interfaces/teamLeaveRequest';
import { DynamictableComponent } from '../../../shared/reusable/dynamictable/dynamictable.component';
import { CommonModule } from '@angular/common';
import { TEAM_LEAVE_REQUEST_ROUTE } from '../../../core/constants/app.constants';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { MatDialog } from '@angular/material/dialog';
import { AcceptleaverequestComponent } from './components/acceptleaverequest/acceptleaverequest/acceptleaverequest.component';
import { switchMap, tap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { ColumnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-teamleaverequest',
  standalone: true,
  templateUrl: './teamleaverequest.component.html',
  styleUrls: ['./teamleaverequest.component.scss'],
  imports: [DynamictableComponent, CommonModule, RouterLink, RouterLinkActive],
})
export class TeamleaverequestComponent implements OnInit, AfterViewInit {
  @ViewChild('actionContainer') actionContainer!: TemplateRef<any>;

  columnMetaData: ColumnMetaDataType[] = [];
  status!: StatusType;
  data: TeamLeaveRequest[] = [];
  routeData = TEAM_LEAVE_REQUEST_ROUTE;
  isLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: CurrentUserService,
    private leaveService: LeaveService,
    private dialog: MatDialog,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        const status = params.get('status');
        this.setStatus(status);
        return this.userService.currentUser$;
      }),
      switchMap(user => {
        if (user) {
          this.isLoading = true;
          this.data=[];
          return this.leaveService.getTeamLeaveRequest(user.id, this.status);
        }
        return of([]); // Return an empty array if no user
      }),
      tap(() => (this.isLoading = false))
    ).subscribe({
      next: (teamLeaveRequest: TeamLeaveRequest[]) => {
        this.data = teamLeaveRequest;
        this.updateColumnMetaData();
      },
      error: (error: any) => {
        this.data = [];
      }
    });
  }

  ngAfterViewInit() {
    this.updateColumnMetaData();
  }

  private setStatus(status: string | null) {
    this.status = this.mapStatus(status);
    this.updateColumnMetaData();
  }

  private mapStatus(status: string | null): StatusType {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Approved';
    }
  }

  private updateColumnMetaData(): void {
    this.columnMetaData = [
      {
        label: 'Resource Name',
        columnName: 'employeeName',
        commonColumnClass: ['flex-grow'],
      },
      {
        label: 'Duration',
        combineData: ['fromDate', 'toDate'],
        type: 'date',
        commonColumnClass: ['flex-grow'],
        typeArgs: ['dd-MMM-yyyy'],
        combineSeprator: ' - ',
      },
      { label: 'First Half', columnName: 'firstHalf', type: 'boolean' },
      { label: 'Second Half', columnName: 'secondHalf', type: 'boolean' },
      {
        label: 'Leave Reason',
        columnName: 'reason',
        rowColumnClass: ['start'],
        hide: this.status !== 'Pending',
        tooltip: true
      },
      {
        columnName: 'action',
        template: this.actionContainer,
        label: 'Action',
        hide: this.status !== 'Pending',
      },
      {
        columnName: 'statusChangeDate',
        label: this.status === 'Rejected' ? 'Rejected On' : 'Accepted On',
        hide: this.status === 'Pending',
        type: 'date',
        typeArgs: ['dd-MMM-yyyy'],
      },
    ];
  }

  accept(element:TeamLeaveRequest): void {
    const dialogRef = this.dialog.open(AcceptleaverequestComponent, {
      data: {
        message: 'Accept Request',
      },
      width: '60%',
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((data) => {
      if (data && data.action === 'Confirm') {
        this.isLoading = true;
        this.data=[];
        this.leaveService
          .updateLeaveRequest(element.id, 'Approved', data.data)
          .subscribe(() => {
            this.toastr.success("Leave request has been approved successfully");
            this.refreshLeaveRequests();
          });
      }
    });
  }

  reject(element: TeamLeaveRequest): void {
    const dialogRef = this.dialog.open(AcceptleaverequestComponent, {
      data: {
        message: 'Reject Request',
      },
      width: '60%',
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe((data) => {
      if (data && data.action === 'Confirm') {
        this.isLoading = true;
        this.data=[];
        this.leaveService
          .updateLeaveRequest(element.id, 'Rejected', data.data)
          .subscribe(() => {
            this.toastr.success("Leave request has been rejected successfully");
            this.refreshLeaveRequests();

          });
      }
    });
  }

  private refreshLeaveRequests() {
    this.isLoading = true;
    this.userService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          this.data = [];
          return this.leaveService.getTeamLeaveRequest(user.id, this.status).pipe(take(1));
        }
        return of([]);
      }),
      tap(() => (this.isLoading = false))
    ).subscribe({
      next: (teamLeaveRequest: TeamLeaveRequest[]) => {
        this.data = teamLeaveRequest;
      },
      error: () => {
        this.data = [];
      }
    });
  }
}