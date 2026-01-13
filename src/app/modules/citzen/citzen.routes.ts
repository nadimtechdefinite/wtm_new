import { Routes } from "@angular/router";
import { AuthGuard } from "../../auth/auth.gaurds";
export const CITIZEN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard', 
        pathMatch: 'full'
      },
      {
        path: 'dashboard',loadComponent: () =>import('../citzen/citizen-dashboard/citizen-dashboard.component').then(m => m.CitizenDashboardComponent),
         canActivate: [AuthGuard],
        data: { title: 'Citizen Dashboard',  role: ['0'] } 
      },
      {
        path: 'add-graviance',loadComponent: () =>import('../citzen/add-graviance/add-graviance.component').then(m => m.AddGravianceComponent),
         canActivate: [AuthGuard],
        data: { title: 'Add Grievance', role: ['0'] }
      },
      {
        path: 'graviance-list',loadComponent: () =>import('../citzen/graviance-list/graviance-list.component').then(m => m.GravianceListComponent),
        canActivate: [AuthGuard],
        data: { title: 'Grievance List', role: ['0'] }
      }
    ]
  }
];
