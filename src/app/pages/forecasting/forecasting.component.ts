import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../../core/services/user/current-user-service.service';
import { LeaveService } from '../../core/services/leave/leave.service';
import { take, tap } from 'rxjs';
import { User } from '../../core/models/interfaces/User';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-forecasting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecasting.component.html',
  styleUrl: './forecasting.component.scss',
})
export class ForecastingComponent implements OnInit {
  constructor(
    private userService: CurrentUserService,
    private leaveService: LeaveService,
    private sanitizer: DomSanitizer
  ) {}
  isLoading: boolean = false;
  imageUrl!: SafeUrl;
  ngOnInit() {
    this.userService.currentUser$
      .pipe(tap(() => (this.isLoading = true)))
      .subscribe((user: User | null) => {
        if (user) {
          this.leaveService
            .getForecasting(user.id)
            .pipe(
              take(1),
              tap(() => (this.isLoading = false))
            )
            .subscribe((data: Blob) => {
              const objectURL = URL.createObjectURL(data);
              this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            });
        }
      });
  }
}
