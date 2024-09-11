import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DynamictableComponent } from '../../../shared/reusable/dynamictable/dynamictable.component';
import { LeaveBalance } from '../../../core/models/interfaces/leaveBalance';
import { columnMetaDataType } from '../../../core/models/interfaces/columnMetaDataType';
import { Subscription } from 'rxjs';
import { CurrentUserService } from '../../../core/services/user/current-user-service.service';
import { LeaveService } from '../../../core/services/leave/leave.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leave-register',
  standalone: true,
  imports: [DynamictableComponent, CommonModule],
  templateUrl: './leave-register.component.html',
  styleUrls: ['./leave-register.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LeaveRegisterComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('buttonRef') buttonRef!: TemplateRef<any>;
  columnMetaData: columnMetaDataType[] = [];
  isLoading: boolean = false;
  leaveData: LeaveBalance[] = [];
  private userSubscription!: Subscription;
  private leaveSubscription!: Subscription;

  constructor(
    private userService: CurrentUserService,
    private leaveService: LeaveService,
    private cd: ChangeDetectorRef,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.currentUser$.subscribe((user) => {
      if (user) {
        this.isLoading = true;
        if (this.leaveSubscription) {
          this.leaveSubscription.unsubscribe();
        }

        this.leaveSubscription = this.leaveService.getLeaveBalance(user.id).subscribe({
          next: (data: LeaveBalance[]) => {
            this.leaveData = data;
            this.isLoading = false;
          },
          error: (error: any) => {
            this.isLoading = false;
            this.leaveData = [];
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    this.initializeColumnMetaData();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.leaveSubscription) {
      this.leaveSubscription.unsubscribe();
    }
  }

  private initializeColumnMetaData(): void {
    this.columnMetaData = [
      {
        columnName: 'month_year',
        label: 'Month & Year',
        type: 'date',
        typeArgs: ['MMMM yyyy'],
        commonColumnClass: ['flex-grow', 'secondary-col', 'start']
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
        rowColumnClass: ['primary-col']
      },
      {
        columnName: 'total_balance',
        label: 'Balance',
        rowColumnClass: ['success-col']
      }
    ];
    this.cd.detectChanges();
  }
}
