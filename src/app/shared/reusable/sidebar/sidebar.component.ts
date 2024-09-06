import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  TEAM_ATTENDANCE,
  MY_ATTENDANCE,
  TEAM_LEAVE_REQUEST,
  TEAM_LEAVE_REGISTER,
} from '../../../core/constants/app.constants';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit{
  showTeamSubRoutes:boolean=false;

  constructor(private router:Router){};

  routeData: any[] = [
    {
      path: TEAM_ATTENDANCE,
      label: 'Team Attendance',
    },
    {
      path: MY_ATTENDANCE,
      label: 'My Attendance',
    }
  ];

  childRouteData: any[] = [
    {
      path: `${TEAM_ATTENDANCE}/${TEAM_LEAVE_REQUEST}/`,
      label: "Team Leave Requests"
    },
    {
      path: `${TEAM_ATTENDANCE}/${TEAM_LEAVE_REGISTER}`,
      label: "Team Register"
    }
  ];


  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.showTeamSubRoutes = this.router.url.includes('teamattendance');
      
    });
  }


 
}
