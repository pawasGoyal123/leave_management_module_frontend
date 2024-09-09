import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { LEAVE_REGISTER, LEAVE_REQUESTS } from '../../../core/constants/app.constants';
import { MatDialog } from '@angular/material/dialog';
import { LeaveReqeustCreationComponent } from './components/leaverequestcreation/leave-reqeust-creation/leave-reqeust-creation.component';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { User } from '../../../core/models/interfaces/User';

@Component({
  selector: 'app-my-attendance-layout',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive,MatIconModule,RouterModule],
  templateUrl: './my-attendance-layout.component.html',
  styleUrl: './my-attendance-layout.component.scss'
})
export class MyAttendanceLayoutComponent {
  constructor(private dialogRef:MatDialog,private leaveService:LeaveService,private userService:CurrentUserService){}
  routeData: any[] = [
    {
      path: LEAVE_REGISTER,
      label: 'Leave Register',
    },
    {
      path: LEAVE_REQUESTS,
      label: 'Leave Request',
    }
  ];

  openLeaveCreationDialog(){
    const leaveCreationRef=this.dialogRef.open(LeaveReqeustCreationComponent,{
      data:{
        message:'Create Leave Request',
      },
    });
    leaveCreationRef.afterClosed().subscribe((data)=>{
      this.userService.currentUser$.subscribe({
        next:(currentUser:(User | null))=>{
          if(currentUser &&  data && data.event=='Create' && data.data){
            this.leaveService.createLeaveRequest(data.data,currentUser.id).subscribe({
              next:(response:any)=>console.log(response)
            })
          }

        }
      })
    })
  }
}
