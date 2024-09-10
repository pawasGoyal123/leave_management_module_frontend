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
  leaveData:myLeaveRequest[]=[];
  private userSubscription!:Subscription;
  isLoading:boolean=false;

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
          rowColumnClass:[],
          tooltip:true
        }
      ];
      this.columnMetaData=data;
      this.cd.detectChanges();
    },0);
    
  }

  ngOnInit(): void {
    this.userSubscription=this.userService.currentUser$.subscribe(async(data)=>{
      if(data){
        this.isLoading=true;
        this.leaveService.getLeaveRequestsByEmployeeId(data.id).subscribe({
          next:(leaveData:myLeaveRequest[])=>{this.leaveData=leaveData;this.isLoading=false},
          error:(error:any)=>{this.leaveData=[];this.isLoading=false;}
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
