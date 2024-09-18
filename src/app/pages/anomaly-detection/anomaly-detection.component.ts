import { Component } from '@angular/core';
import { CurrentUserService } from '../../core/services/user/current-user-service.service';
import { LeaveService } from '../../core/services/leave/leave.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { take, tap } from 'rxjs';
import { User } from '../../core/models/interfaces/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anomaly-detection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anomaly-detection.component.html',
  styleUrl: './anomaly-detection.component.scss',
})
export class AnomalyDetectionComponent {
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
            .getAnomalyDetection(user.id)
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
