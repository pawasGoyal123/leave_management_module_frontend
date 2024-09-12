import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { LEAVE_REGISTER, LEAVE_REQUESTS } from '../../../core/constants/app.constants';
import { MatDialog } from '@angular/material/dialog';

import { LeaveService } from '../../../core/services/leave/leave.service';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { Subscription } from 'rxjs';
import { take} from 'rxjs/operators';
import { LeaveRequestCreationComponent } from './components/leaverequestcreation/leave-reqeust-creation/leave-reqeust-creation.component';

@Component({
  selector: 'app-my-attendance-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, RouterModule],
  templateUrl: './my-attendance-layout.component.html',
  styleUrls: ['./my-attendance-layout.component.scss']
})
export class MyAttendanceLayoutComponent implements OnDestroy {
  private dialogSubscription!: Subscription;
  routeData = [
    {
      path: LEAVE_REGISTER,
      label: 'Leave Register',
    },
    {
      path: LEAVE_REQUESTS,
      label: 'Leave Request',
    }
  ];

  constructor(
    private dialog: MatDialog,
    private leaveService: LeaveService,
    private userService: CurrentUserService
  ) {}

  openLeaveCreationDialog(): void {
    const leaveCreationRef = this.dialog.open(LeaveRequestCreationComponent, {
      data: { message: 'Create Leave Request' },
      disableClose:true
    });

    this.dialogSubscription = leaveCreationRef.afterClosed().pipe(
    ).subscribe(data => {
     if(data?.created){
      this.leaveService.emitLeaveRequestCreated();
     }
      this.dialogSubscription.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
  }
}