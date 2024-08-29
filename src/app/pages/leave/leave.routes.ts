import { Routes } from '@angular/router';
import { LeavebalanceComponent } from './leavebalance/leavebalance.component';
import { LeaveRequestApprovalComponent } from './leave-request-approval/leave-request-approval.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { TeamAttendanceComponent } from './team-attendance/team-attendance.component';
import { MyAttendanceLayoutComponent } from './my-attendance-layout/my-attendance-layout.component';
import { LeaveRegisterComponent } from './leave-register/leave-register.component';

export const routes: Routes = [
    {
        path:"attendancemanagement/attendance/teammonthlyattendance",
        component:TeamAttendanceComponent
    },
    {
        path:"attendancemanagement/attendance/myattendance",
        component:MyAttendanceLayoutComponent,
        children:[
            {
                path:"leaveRegister",
                component:LeaveRegisterComponent
            },
            {
                path:"leaveRequests",
                component:LeaveRequestComponent
            }
        ]
    },
    {
        path:"**",
        redirectTo:"attendancemanagement/attendance/teammonthlyattendance"
    }
];
