import { Routes } from "@angular/router";
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
        data: { title: 'Citizen Dashboard' } 
      },
      {
        path: 'add-graviance',loadComponent: () =>import('../citzen/add-graviance/add-graviance.component').then(m => m.AddGravianceComponent),
        data: { title: 'Add Grievance' }
      },
      {
        path: 'graviance-list',loadComponent: () =>import('../citzen/graviance-list/graviance-list.component').then(m => m.GravianceListComponent),
        data: { title: 'Grievance List' }
      }
    ]
  }
];
