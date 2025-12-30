import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../officer/officer-dashboard/officer-dashboard.component')
            .then(m => m.OfficerDashboardComponent),
        data: { title: 'Admin Dashboard' }
      },
            {
        path: 'admin-grievance-list',
        loadComponent: () =>
          import('../officer/grievance-list-admin/grievance-list-admin.component')
            .then(m => m.GrievanceListAdminComponent),
        data: { title: 'Admin Grievance-List ' }
      },
      
    ]
  }
];

