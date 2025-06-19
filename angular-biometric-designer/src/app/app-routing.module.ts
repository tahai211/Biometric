import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';


const routes: Routes = [
  { path:'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./views/pages/inbox/inbox.module').then(m => m.InboxModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'identity',
        loadChildren: () => import('./views/pages/identity/identity.module').then(m => m.IdentityModule)
      },
      {
        path: 'system',
        loadChildren: () => import('./views/pages/system/system.module').then(m => m.SystemModule)
      },
      {
        path: 'helpdesk',
        loadChildren: () => import('./views/pages/helpdesk/helpdesk.module').then(m => m.HelpdeskModule)
      },
      {
        path: 'svcard',
        loadChildren: () => import('./views/pages/svcard/svcard.module').then(m => m.SvcardModule)
      },
      {
        path: 'cardmanage',
        loadChildren: () => import('./views/pages/cardmanage/cardmanage.module').then(m => m.CardmanageModule)
      },
      { path: '', redirectTo: '', pathMatch: 'full' }, 
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { 
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: true  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
