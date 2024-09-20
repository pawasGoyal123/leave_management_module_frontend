import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs';
import {
  MY_ATTENDANCE,
  TEAM_ATTENDANCE,
  TEAM_LEAVE_REGISTER,
  TEAM_LEAVE_REQUEST,
} from '../../../core/constants/app.constants';
import { Route } from '../../../core/models/interfaces/routeType';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  showTeamSubRoutes: boolean = false;

  constructor(private router:Router) {}

  routeData: Route<string, string>[] = [
    {
      path: TEAM_ATTENDANCE,
      label: 'Team Attendance',
    },
    {
      path: MY_ATTENDANCE,
      label: 'My Attendance',
    },
  ];

  childRouteData: Route<string, string>[] = [
    {
      path: `${TEAM_ATTENDANCE}/${TEAM_LEAVE_REQUEST}/`,
      label: 'Team Leave Requests',
    },
    {
      path: `${TEAM_ATTENDANCE}/${TEAM_LEAVE_REGISTER}`,
      label: 'Team Register',
    },
    {
      path: `${TEAM_ATTENDANCE}/forecasting`,
      label: 'Forecasting',
    }
  ];

  ngOnInit(): void {
    this.showTeamSubRoutes=this.router.url.includes('teamattendance');
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){
        this.showTeamSubRoutes=event.urlAfterRedirects.includes('teamattendance');
      }
    })
  }
}
