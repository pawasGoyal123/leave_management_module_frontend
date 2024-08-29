import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LeaveBalance } from '../../../core/models/interfaces/leaveBalance';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-leavebalance',
  standalone: true,
  imports: [MatTableModule, MatSortModule,DatePipe],
  templateUrl: './leavebalance.component.html',
  styleUrls: ['./leavebalance.component.scss']
})
export class LeavebalanceComponent implements AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;

  dataSource: LeaveBalance[] = [
    {
      month: new Date(),
      year: new Date(),
      available: 1,
      accured: 1,
      consumed: 0,
      balance: 1
    },
    {
      month: new Date(2025, 0, 1),
      year: new Date(2025, 0, 1),
      available: 1,
      accured: 1,
      consumed: 0,
      balance: 0
    }
  ];

  dataSource1 = new MatTableDataSource<LeaveBalance>(this.dataSource);
  displayedColumns: string[] = ['monthYear', 'available', 'accured', 'consumed', 'balance'];


  ngAfterViewInit() {
    this.dataSource1.sort = this.sort;

    setTimeout(() => {
      this.sort.active = 'month';
      this.sort.direction = 'desc';
      this.dataSource1.sort = this.sort;
    }, 0);

    this.dataSource1.sortingDataAccessor = (item: LeaveBalance, property: string) => {
      switch (property) {
        case 'month':
          return item.month ? new Date(item.month).getTime() : 0;
        case 'year':
          return item.year ? new Date(item.year).getFullYear() : 0;
        case 'available':
        case 'accured':
        case 'consumed':
        case 'balance':
          return item[property];
        default:
          return '';
      }
    };
  }
}
