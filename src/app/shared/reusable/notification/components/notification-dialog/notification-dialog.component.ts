import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NotificationType } from '../../../../../core/models/interfaces/notification';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../../core/services/notification/notification.service';
@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule],
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss'
})
export class NotificationDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: NotificationType,private notificationService:NotificationService,private dialog:MatDialogRef<NotificationDialogComponent>){
  };
  updated:boolean=false;

  ngOnInit(): void {
    if(this.data.status==false){
      this.notificationService.updateNotificationStatus(this.data.id).subscribe(()=>{this.updated=true;this.data.status=true});
    }
  }

  closeModal(){
    this.dialog.close({data:this.data,updated:this.updated});
  }
}