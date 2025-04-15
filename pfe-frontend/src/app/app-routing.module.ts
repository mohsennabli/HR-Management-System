import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'admin',
    loadChildren: () => import('src/app/core/dashboards/admin/admin-dashboard.module').then(m => m.AdminDashboardModule)
  },
  { 
    path: 'hr',
    loadChildren: () => import('src/app/core/dashboards/hr/hr-dashboard.module').then(m => m.HrDashboardModule)
  },
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: '**', redirectTo: '/admin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }