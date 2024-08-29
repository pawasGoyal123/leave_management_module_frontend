import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  routeData: any[] = [
    {
      path: 'attendancemanagement/attendance/teammonthlyattendance',
      label: 'Team Attendance',
    },
    {
      path: 'attendancemanagement/attendance/myattendance',
      label: 'My Attendance',
    }
  ];
}
