import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { LayoutComponent } from './modules/layout-wrapper/layout/layout.component';
import { WebsiteWrapperComponent } from './core/components/website-wrapper/website-wrapper.component';

export const routes: Routes = [
  // Public pages + auth pages (WebsiteWrapperComponent)
  {
    path: '',
    component: WebsiteWrapperComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./core/components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'graviance-register',
        loadComponent: () =>
          import('./core/components/graviance-register/graviance-register.component')
            .then(m => m.GravianceRegisterComponent)
      },
      // Spread auth routes here
      ...authRoutes
    ]
  },

  // Dashboard wrapper
  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('../app/modules/officer/officer.routes').then(r => r.ADMIN_ROUTES)
      },
      {
        path: 'citizen',
        loadChildren: () =>
          import('../app/modules/citzen/citzen.routes').then(r => r.CITIZEN_ROUTES)
      },
      {
        path: '',
        redirectTo: 'citizen/dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Wildcard
  { path: '**', redirectTo: '' }
];
