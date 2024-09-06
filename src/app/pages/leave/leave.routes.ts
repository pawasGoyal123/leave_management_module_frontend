import { Routes } from '@angular/router';
import {
  TEAM_ATTENDANCE,
  MY_ATTENDANCE,
  TEAM_LEAVE_REQUEST,
  TEAM_LEAVE_REGISTER,
  STATUS_PARAM,
  LEAVE_REGISTER,
  LEAVE_REQUESTS,

} from '../../core/constants/app.constants';

import { TeamleaverequestComponent } from './teamleaverequest/teamleaverequest.component';
import { TeamleaveregisterComponent } from './teamleaveregister/teamleaveregister.component';
import { MyAttendanceLayoutComponent } from './my-attendance-layout/my-attendance-layout.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { LeaveRegisterComponent } from './leave-register/leave-register.component';

export const routes: Routes = [
  {
    path: TEAM_ATTENDANCE,
    children: [
      {
        path: `${TEAM_LEAVE_REQUEST}/${STATUS_PARAM}`,
        component: TeamleaverequestComponent,
      },
      {
        path: TEAM_LEAVE_REGISTER,
        component: TeamleaveregisterComponent,
      },
      {
        path: '',
        redirectTo: `${TEAM_LEAVE_REQUEST}/pending`,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: MY_ATTENDANCE,
    component: MyAttendanceLayoutComponent,
    children: [
      {
        path: LEAVE_REGISTER,
        component: LeaveRegisterComponent,
      },
      {
        path: LEAVE_REQUESTS,
        component: LeaveRequestComponent,
      },
      {
        path: '',
        redirectTo: LEAVE_REGISTER,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: `${TEAM_ATTENDANCE}/${TEAM_LEAVE_REQUEST}/pending`,
  },
];
