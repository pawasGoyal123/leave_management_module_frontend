import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DropdownModule } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
import { NotificationType } from '../../../core/models/interfaces/notification';
import { User } from '../../../core/models/interfaces/User';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { getUserProfileName } from '../../utils/getUserProfileName';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    NotificationComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription!: Subscription;
  showNotification = signal<boolean>(false);
  unreadCount: number = 0;
  allUsers: User[] = [];

  constructor(
    private userService: CurrentUserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.allUsers = data;
    });
    this.userSubscription = this.userService.currentUser$.subscribe(
      (data: User | null) => {
        this.currentUser = data;
        if (data) {
          this.notificationService
            .getAllNotifications(data.id)
            .subscribe((data: NotificationType[]) => {
              this.unreadCount = data.reduce((prev, curr) => {
                return prev + (curr.status ? 0 : 1);
              }, 0);
            });
        }
      }
    );
  }

  changeActiveUser() {
    if (this.currentUser) {
      this.userService.changeCurrentUser(this.currentUser);
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  get ProfileName(): string {
    return getUserProfileName(this.currentUser!.name);
  }

  toggleDisplay() {
    this.showNotification.set(!this.showNotification());
  }

  refreshNotifications($data: NotificationType[]) {
    this.unreadCount = $data.reduce(
      (prev, curr) => prev + (curr.status ? 0 : 1),
      0
    );
    this.toggleDisplay();
  }
}
