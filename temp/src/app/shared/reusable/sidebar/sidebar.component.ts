import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  routeData:any[]=[
    {
      path:"leave-balance",
      label:"Leave Balance"
    },
    {
      path:"leave-request-approval",
      label:"Leave Request Approval"
    },
    {
      path:"leave-requests",
      label:"Leave Requests"
    }
  ]
}
