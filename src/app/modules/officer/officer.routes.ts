import { Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.gaurds';

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
        canActivate: [AuthGuard],
        data: { title: 'Admin Dashboard', role: ['1','2']}
      },
      {
        path: 'admin-grievance-list',
        loadComponent: () =>
          import('../officer/grievance-list-admin/grievance-list-admin.component')
            .then(m => m.GrievanceListAdminComponent),
        canActivate: [AuthGuard],
        data: { title: 'Admin Grievance List', role: ['1','2']}
      }
    ]
  }
];
