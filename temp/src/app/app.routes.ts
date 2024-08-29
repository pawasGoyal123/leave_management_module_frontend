import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",
        loadComponent:(()=>import('../app/pages/leave/commonlayout/commonlayout.component').then(m=>m.CommonlayoutComponent)),
        loadChildren:(()=>import("../app/pages/leave/leave.routes").then(m=>m.routes))
        
    }
];
