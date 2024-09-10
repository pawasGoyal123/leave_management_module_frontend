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
import { columnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import {
  statusType,
  TeamLeaveRequest,
} from '../../../core/models/interfaces/teamLeaveRequest';
import { DynamictableComponent } from '../../../shared/reusable/dynamictable/dynamictable.component';
import { CommonModule } from '@angular/common';
import { TEAM_LEAVE_REQUEST_ROUTE } from '../../../core/constants/app.constants';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { MatDialog } from '@angular/material/dialog';
import { AcceptleaverequestComponent } from './components/acceptleaverequest/acceptleaverequest/acceptleaverequest.component';


function generateLeaveRequests(num:number):TeamLeaveRequest[] {
  const leaveRequests:TeamLeaveRequest[] = [];
  const reasons = [
    "Family function",
    "Medical leave",
    "Personal reasons",
    "Vacation",
    "Emergency",
    "Work from home",
    "Training",
    "Other",
  ];

  for (let i = 1; i <= num; i++) {
    const fromDate = new Date(2024, 6, 12); // July is month 6 (0-indexed)
    const toDate = new Date(2024, 6, 12);
    
    leaveRequests.push({
      id: i,
      employeeName: `Employee ${i}`,
      fromDate: fromDate,
      toDate: toDate,
      firstHalf: Math.random() < 0.5, // Random boolean
      secondHalf: Math.random() < 0.5, // Random boolean
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      statusChangeDate: new Date(),
      status: Math.random() < 0.5 ? "Approved" : "Pending", // Random status
    });
  }

  return leaveRequests;
}
@Component({
  selector: 'app-teamleaverequest',
  standalone: true,
  templateUrl: './teamleaverequest.component.html',
  styleUrls: ['./teamleaverequest.component.scss'],
  imports: [DynamictableComponent, CommonModule, RouterLink, RouterLinkActive],
})
export class TeamleaverequestComponent implements OnInit, AfterViewInit {
  @ViewChild('actionContainer') actionContainer!: TemplateRef<any>;

  columnMetaData: columnMetaDataType[] = [];
  status!: statusType;
  data: TeamLeaveRequest[] = [];
  routeData = TEAM_LEAVE_REQUEST_ROUTE;
  isLoading:boolean=false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private userService: CurrentUserService,
    private leaveService: LeaveService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const status = params.get('status');
      this.setStatus(status);
    });
  }

  ngAfterViewInit() {
    this.updateColumnMetaData();
  }

  private setStatus(status: string | null) {
    this.status = this.mapStatus(status);
    this.updateColumnMetaData();
    this.userService.currentUser$.subscribe(async (data) => {
      if (data) {
        this.isLoading=true;
        this.leaveService.getTeamLeaveRequest(data.id, this.status).subscribe({
          next: (teamLeaveRequest: TeamLeaveRequest[]) =>
            {this.data=teamLeaveRequest;this.isLoading=false;},
          error:(error:any)=>{this.data=generateLeaveRequests(200);this.isLoading=false;}
        });
      }
    });
    this.cdr.detectChanges();
  }

  private mapStatus(status: string | null): statusType {
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
        combineSeprator: ' - ', // Ensure correct spelling
      },
      { label: 'First Half', columnName: 'firstHalf', type: 'boolean' },
      { label: 'Second Half', columnName: 'secondHalf', type: 'boolean' },
      {
        label: 'Leave Reason',
        columnName: 'reason',
        rowColumnClass: ['start'],
        hide: this.status != 'Pending',
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

  accept(element: any): void {
    const dialogRef = this.dialog.open(AcceptleaverequestComponent, {
      data: {
        message: 'Accept Request',
      },
      width: '60%',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.action == 'Confirm') {
        this.leaveService
          .updateLeaveRequest(element.id, 'Approved', data.data)
          .subscribe((_) => this.removeLeaveFromList(element.id));
      }
    });
  }

  reject(element: any): void {
    const dialogRef = this.dialog.open(AcceptleaverequestComponent, {
      data: {
        message: 'Reject Request',
      },
      width: '60%',
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.action == 'Confirm') {
        this.leaveService
          .updateLeaveRequest(element.id, 'Rejected', data.data)
          .subscribe((_) => this.removeLeaveFromList(element.id));
      }
    });
  }

  private removeLeaveFromList(leaveId: number) {
    this.data = this.data.filter((item) => item.id !== leaveId);
    this.cdr.detectChanges();
  }
}
