import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationType } from '../../../core/models/interfaces/notification';
import { MatIconModule } from '@angular/material/icon';
import { TimeagoPipe } from '../../pipes/timeago/timeago.pipe';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from './components/notification-dialog/notification-dialog.component';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { User } from '../../../core/models/interfaces/User';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule,MatIconModule,TimeagoPipe],
  providers:[TimeagoPipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
  notifications:NotificationType[]=[];
  loading:boolean=false;
  unreadCount:number=0;
  @Output() close=new EventEmitter<NotificationType[]>();
  constructor(private dialog:MatDialog,private userService:CurrentUserService,private notificationService:NotificationService){};

  onClose(){
    this.close.emit(this.notifications);
  }

  calculateUnread(notifications:NotificationType[]){
    return notifications.reduce((prev,curr)=>(prev+(curr.status?0:1)),0);
  }

  markRead(notification:NotificationType,index:number){
    const notificationDialog=this.dialog.open(NotificationDialogComponent,{
      data:notification
    });
    notificationDialog.afterClosed().subscribe((data)=>{
      if(data.updated){
        this.notifications[index]=data.data;
        this.unreadCount=this.calculateUnread(this.notifications);
      }
    })
  }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((data:(User | null))=>{
      if(data){
        this.loading=true;
        this.notificationService.getAllNotifications(data.id).subscribe({
          next:(notifications:NotificationType[])=>{this.notifications=notifications;this.loading=false;this.unreadCount=this.calculateUnread(this.notifications)},
          error:()=>{this.notifications=[],this.loading=false;}
        })
      }
    })
  }
}
