import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DropdownModule } from 'primeng/dropdown';
import { take, tap } from 'rxjs';
import { Employee } from '../../core/models/interfaces/Employee';
import { LeaveService } from '../../core/services/leave/leave.service';
import { CurrentUserService } from '../../core/services/user/current-user-service.service';

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
  //list of all the employees under the manager

  currentEmployee: Employee | null = null;
  //current Employee for which the anomaly detection must be fetched

  isLoading: boolean = false;
  //denotes the loading state while model is processing

  imageUrl!: SafeUrl;
  //url fetched from the model to show the data

  ngOnInit() {
    this.userService.currentUser$.subscribe((data) => {
      if (data) {
        this.leaveService
          .getEmployeesByManagerId(data.id)
          .pipe(take(1))
          .subscribe((employees) => {
            this.employees = employees;
          });
      }
    });

    //fetches the list of all employees once the current user which maybe manager or employee changes from the dropdown
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
    //if the currentEmployee is not null we make a call to fetch the anomaly detection data for the currentEmployee when the currentEmployee changes
  }
}
