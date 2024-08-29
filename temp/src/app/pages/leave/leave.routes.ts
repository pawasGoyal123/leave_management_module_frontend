import { Routes } from '@angular/router';
import { LeavebalanceComponent } from './leavebalance/leavebalance.component';
import { LeaveRequestApprovalComponent } from './leave-request-approval/leave-request-approval.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';

export const routes: Routes = [
    {
     path:"leave-balance",
     component:LeavebalanceComponent   
    },
    {
        path:"leave-requests",
        component:LeaveRequestComponent
    },
    {
        path:"leave-request-approval",
        component:LeaveRequestApprovalComponent
    },
    {
        path:"**",
        redirectTo:"leave-balance"
    }
];
