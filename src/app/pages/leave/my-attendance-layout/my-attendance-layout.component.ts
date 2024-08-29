import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-my-attendance-layout',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive,MatIconModule],
  templateUrl: './my-attendance-layout.component.html',
  styleUrl: './my-attendance-layout.component.scss'
})
export class MyAttendanceLayoutComponent {
  routeData: any[] = [
    {
      path: 'leaveRegister',
      label: 'Leave Register',
    },
    {
      path: 'leaveRequests',
      label: 'Leave Request',
    }
  ];
}
