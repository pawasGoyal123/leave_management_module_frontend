import { Component, OnInit } from '@angular/core';
import { DynamictableComponent } from '../../../shared/reusable/dynamictable/dynamictable.component';
import { columnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import { TeamLeaveRegister } from '../../../core/models/interfaces/TeamLeaveRegister';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { lastValueFrom } from 'rxjs';
import { User } from '../../../core/models/interfaces/User';

@Component({
  selector: 'app-teamleaveregister',
  standalone: true,
  imports: [DynamictableComponent],
  templateUrl: './teamleaveregister.component.html',
  styleUrl: './teamleaveregister.component.scss'
})
export class TeamleaveregisterComponent implements OnInit {
  initialData:TeamLeaveRegister[]=[{
    name:'Pawas Goyal',
    employeeCode:'APS-31714',
    availableLeaves:10.0
  }]

  constructor(private leaveService:LeaveService,private userService:CurrentUserService){};

    ngOnInit() {
      this.userService.currentUser$.subscribe((currentUser:User|null)=>{
        if(currentUser){
          this.leaveService.getTeamLeaveRegister(currentUser.id).subscribe({
            next:(teamLeaveRegisterData:TeamLeaveRegister[])=>this.initialData=teamLeaveRegisterData
          })
        }
      })
    }
  
  columnMetaData:columnMetaDataType[]=[
    {
      label:'Employee',
      columnName:'name',
      commonColumnClass:['flex-grow','start']
    },
    {
      label:'Employee Code',
      columnName:'employeeCode'
    },
    {
      label:'Available Leaves',
      columnName:'availableLeaves',
      rowColumnClass:['success-col']
    }
  ]
}
