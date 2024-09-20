import { Routes } from '@angular/router';
import {
  LEAVE_REGISTER,
  LEAVE_REQUESTS,
  MY_ATTENDANCE,
  STATUS_PARAM,
  TEAM_ATTENDANCE,
  TEAM_LEAVE_REGISTER,
  TEAM_LEAVE_REQUEST,
} from '../../core/constants/app.constants';

import { AnomalyDetectionComponent } from '../anomaly-detection/anomaly-detection.component';
import { ForecastingComponent } from '../forecasting/forecasting.component';
import { LeaveRegisterComponent } from './leave-register/leave-register.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { MyAttendanceLayoutComponent } from './my-attendance-layout/my-attendance-layout.component';
import { TeamleaveregisterComponent } from './teamleaveregister/teamleaveregister.component';
import { TeamleaverequestComponent } from './teamleaverequest/teamleaverequest.component';

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
        path: 'forecasting',
        component: ForecastingComponent,
      },
      {
        path: 'anomaly-detection',
        component: AnomalyDetectionComponent,
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
