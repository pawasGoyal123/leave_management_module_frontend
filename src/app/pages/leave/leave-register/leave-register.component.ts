import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { LeaveBalance } from '../../../core/models/interfaces/leaveBalance';
import { DynamictableComponent } from '../../../shared/reusable/dynamictable/dynamictable.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ColumnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leave-register',
  standalone: true,
  imports: [DynamictableComponent, CommonModule],
  templateUrl: './leave-register.component.html',
  styleUrls: ['./leave-register.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class LeaveRegisterComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild('buttonRef') buttonRef!: TemplateRef<any>;
  columnMetaData: ColumnMetaDataType[] = [];
  leaveData: LeaveBalance[] = [];
  isLoading = false;

  // Handle multiple subscriptions with a Subscription object
  private subscriptions = new Subscription();

  constructor(
    private userService: CurrentUserService,
    private leaveService: LeaveService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Subscribe to the current user
    const userSubscription = this.userService.currentUser$.subscribe((user) => {
      if (user) {
        this.isLoading = true;
        // Fetch leave balance data if user exists
        const leaveSubscription = this.leaveService
          .getLeaveBalance(user.id)
          .subscribe({
            next: (data: LeaveBalance[]) => {
              this.leaveData = data;
              this.isLoading = false;
            },
            error: () => {
              this.leaveData = [];
              this.isLoading = false;
            },
          });

        // Add leaveSubscription to the subscriptions pool
        this.subscriptions.add(leaveSubscription);
      } else {
        this.toastr.error(
          'Please select a user for fetching leave register data'
        );
        //if the user does not exist show prompt to select user
      }
    });

    // Add userSubscription to the subscriptions pool
    this.subscriptions.add(userSubscription);
  }

  ngAfterViewInit(): void {
    this.initializeColumnMetaData();
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions at once
    this.subscriptions.unsubscribe();
  }

  private initializeColumnMetaData(): void {
    this.columnMetaData = [
      {
        columnName: 'month_year',
        label: 'Month & Year',
        type: 'date',
        typeArgs: ['MMMM yyyy'],
        commonColumnClass: ['flex-grow', 'secondary-col', 'start'],
      },
      {
        columnName: 'available',
        label: 'Available',
      },
      {
        columnName: 'accrued',
        label: 'Accrued',
      },
      {
        columnName: 'consumed',
        label: 'Consumed',
        rowColumnClass: ['primary-col'],
      },
      {
        columnName: 'total_balance',
        label: 'Balance',
        rowColumnClass: ['success-col'],
      },
    ];
    this.cd.detectChanges();
  }
}
