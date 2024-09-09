import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { User } from '../../../core/models/interfaces/User';
import { columnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import { myLeaveRequest } from '../../../core/models/interfaces/myLeaveRequest';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { DynamictableComponent } from '../../../shared/reusable/dynamictable/dynamictable.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [DynamictableComponent,CommonModule],
  templateUrl: './leave-request.component.html',
  styleUrl: './leave-request.component.scss'
})
export class LeaveRequestComponent {
  @ViewChild('buttonRef') buttonRef!: TemplateRef<any>;
  columnMetaData: columnMetaDataType[]=[];
  leaveData:myLeaveRequest[]=[
    {
      id: 1,
      fromDate: new Date('2024-08-15'),
      toDate: new Date('2024-08-15'),
      firstHalf: true,
      secondHalf: false,
      status: 'Pending',
      managerComment: null,
    },
    {
      id: 2,
      fromDate: new Date('2024-09-01'),
      toDate: new Date('2024-09-05'),
      firstHalf: false,
      secondHalf: true,
      status: 'Approved',
      managerComment: 'Enjoy your time off!',
    },
    {
      id: 3,
      fromDate: new Date('2024-07-20'),
      toDate: new Date('2024-07-20'),
      firstHalf: false,
      secondHalf: true,
      status: 'Rejected',
      managerComment: 'Insufficient leave balance.',
    },
    {
      id: 4,
      fromDate: new Date('2024-10-10'),
      toDate: new Date('2024-10-12'),
      firstHalf: true,
      secondHalf: false,
      status: 'Pending',
      managerComment: null,
    },
    {
      id: 5,
      fromDate: new Date('2024-11-15'),
      toDate: new Date('2024-11-18'),
      firstHalf: false,
      secondHalf: true,
      status: 'Approved',
      managerComment: 'Approved. Please plan your work accordingly.',
    },
  ];
  private userSubscription!:Subscription;

  constructor(private userService:CurrentUserService,private leaveService:LeaveService,private cd:ChangeDetectorRef){};

  ngAfterViewInit(){
    setTimeout(()=>{
      const data:columnMetaDataType[]=[
        {
          columnName: 'duration',
          label: 'Duration Requested',
          type: 'date',
          typeArgs: ['dd-MMM'],
          combineData:['fromDate','toDate'],
          combineSeprator:' - ',
          commonColumnClass: ['flex-grow','start']
        },
        {
          columnName: 'firstHalf',
          label: 'First Half',
          type:'boolean'
        },
        {
          columnName: 'secondHalf',
          label: 'Second Half',
          type:'boolean',
        },
        {
          columnName: 'status',
          label: 'Status',
          type:'status'
        },
        {
          columnName: 'managerComment',
          label: 'Manager Comment',
          commonColumnClass:['overflow-content'],
          rowColumnClass:[]
        }
      ];
      this.columnMetaData=data;
      this.cd.detectChanges();
    },0);
    
  }

  ngOnInit(): void {
    this.userSubscription=this.userService.currentUser$.subscribe(async(data)=>{
      if(data){
        this.leaveService.getLeaveRequestsByEmployeeId(data.id).subscribe({
          next:(leaveData:myLeaveRequest[])=>this.leaveData=leaveData,
          error:(error:any)=>console.log(error)
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
