import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DynamictableComponent } from '../../../shared/reusable/dynamictable/dynamictable.component';
import { LeaveBalance } from '../../../core/models/interfaces/leaveBalance';
import { columnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import { User } from '../../../core/models/interfaces/User';
import { firstValueFrom, Subscription } from 'rxjs';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-register',
  standalone: true,
  imports: [DynamictableComponent,CommonModule],
  templateUrl: './leave-register.component.html',
  styleUrls: ['./leave-register.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LeaveRegisterComponent implements AfterViewInit,OnInit,OnDestroy  {
  @ViewChild('buttonRef') buttonRef!: TemplateRef<any>;
  columnMetaData: columnMetaDataType[]=[];
  leaveData:LeaveBalance[]=[
    {
      month_year:new Date(),
      accrued:1,
      available:1,
      total_balance:1,
      consumed:0
    }
  ];
  private userSubscription!:Subscription;

  constructor(private userService:CurrentUserService,private leaveService:LeaveService){};

  ngAfterViewInit(){
    setTimeout(()=>{
      const data:columnMetaDataType[]=[
        {
          columnName: 'month_year',
          label: 'Month & Year',
          type: 'date',
          typeArgs: ['MMMM yyyy'],
          commonColumnClass:['flex-grow','secondary-col','start']
        },
        {
          columnName:'accrued',
          label:'Accured',
        },
        {
          columnName: 'available',
          label: "Available",
        },
        {
          columnName:'consumed',
          label:'Consumed',
          rowColumnClass:['primary-col']
        },
        {
          columnName:'total_balance',
          label:"Balance",
          rowColumnClass:['success-col']
        }

      ];
      this.columnMetaData=data;
    },0);
    
  }

  ngOnInit(): void {
    this.userSubscription=this.userService.currentUser$.subscribe(async(data)=>{
      if(data){
        this.leaveData=await firstValueFrom(this.leaveService.getLeaveBalance(data.id));
      
      }
    })
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }


  

  
}
