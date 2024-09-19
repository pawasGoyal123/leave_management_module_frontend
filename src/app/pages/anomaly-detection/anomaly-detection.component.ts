import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../../core/services/user/current-user-service.service';
import { LeaveService } from '../../core/services/leave/leave.service';
import { take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../core/models/interfaces/Employee';

@Component({
  selector: 'app-anomaly-detection',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule],
  templateUrl: './anomaly-detection.component.html',
  styleUrl: './anomaly-detection.component.scss',
})
export class AnomalyDetectionComponent implements OnInit {
  constructor(
    private userService: CurrentUserService,
    private leaveService: LeaveService,
    private sanitizer: DomSanitizer
  ) {}
  employees: Employee[] = [];
  currentEmployee: Employee | null = null;
  isLoading: boolean = false;
  imageUrl!: SafeUrl;
  ngOnInit() {
    this.userService.currentUser$.subscribe((data) => {
      if (data) {
        this.leaveService
          .getEmployeesByManagerId(data.id)
          .pipe(take(1))
          .subscribe((employee) => {
            this.employees = employee;
          });
      }
    });
  }

  changeCurrentEmployee() {
    if (this.currentEmployee) {
      this.isLoading = true;
      this.leaveService
        .getAnomalyDetection(this.currentEmployee.id)
        .pipe(
          take(1),
          tap(() => (this.isLoading = false))
        )
        .subscribe((data) => {
          const objectURL = URL.createObjectURL(data);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        });
    }
  }
}
