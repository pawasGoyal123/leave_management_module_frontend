import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, take } from 'rxjs';
import { NotificationType } from '../../../core/models/interfaces/notification';
import { User } from '../../../core/models/interfaces/User';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { TimeagoPipe } from '../../pipes/timeago/timeago.pipe';
import { NotificationDialogComponent } from './components/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, TimeagoPipe],
  providers: [TimeagoPipe],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: NotificationType[] = [];
  loading: boolean = false;
  unreadCount: number = 0;
  @Output() close = new EventEmitter<NotificationType[]>();
  private userSubscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private userService: CurrentUserService,
    private notificationService: NotificationService
  ) {}

  onClose(): void {
    this.close.emit(this.notifications);
  }

  calculateUnread(notifications: NotificationType[]): number {
    return notifications.reduce(
      (count, curr) => count + (curr.status ? 0 : 1),
      0
    );
  }

  markRead(notification: NotificationType, index: number): void {
    const notificationDialog = this.dialog.open(NotificationDialogComponent, {
      data: notification,
      disableClose: true,
    });

    notificationDialog
      .afterClosed()
      .pipe(take(1))
      .subscribe((data) => {
        if (data?.updated) {
          this.notifications[index] = data.data;
          this.unreadCount = this.calculateUnread(this.notifications);
        }
      });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.currentUser$.subscribe(
      (user: User | null) => {
        if (user) {
          this.loading = true;
          this.notificationService.getAllNotifications(user.id).subscribe({
            next: (notifications: NotificationType[]) => {
              this.notifications = notifications;
              this.unreadCount = this.calculateUnread(this.notifications);
              this.loading = false;
            },
            error: () => {
              this.notifications = [];
              this.loading = false;
            },
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
