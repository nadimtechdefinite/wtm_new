import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { LayoutComponent } from './modules/layout-wrapper/layout/layout.component';
import { WebsiteWrapperComponent } from './core/components/website-wrapper/website-wrapper.component';
import { AuthGuard } from './auth/auth.gaurds';
import { KeyboardSettingComponent } from './keyboard-setting/keyboard-setting.component';
import { ScreenReaderComponent } from './core/components/screen-reader/screen-reader.component';

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
        path: 'home-new',
        loadComponent: () =>
          import('./core/components/home-new/home.component').then(m => m.HomeNewComponent)
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
      {
        path: 'screen-reader',
        loadComponent: () =>
          import('./core/components/screen-reader/screen-reader.component').then(m => m.ScreenReaderComponent)
      },

      {
        path: 'sitemap',
        loadComponent: () =>
          import('./core/components/sitemap/sitemap.component').then(m => m.SitemapComponent)
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
      canMatch: [AuthGuard],
      data: { role: ['1','2'] },
      loadChildren: () =>
        import('../app/modules/officer/officer.routes')
          .then(r => r.ADMIN_ROUTES)
    },
    {
      path: 'citizen',
      canMatch: [AuthGuard],
      data: { role: ['0'] },
      loadChildren: () =>
        import('../app/modules/citzen/citzen.routes')
          .then(r => r.CITIZEN_ROUTES)
    },
    {
      path: '',
      redirectTo: 'citizen/dashboard',
      pathMatch: 'full'
    }
  ]
},

{path:'keyboard-setting', component:KeyboardSettingComponent},
{ path: '**', redirectTo: '' }
];
