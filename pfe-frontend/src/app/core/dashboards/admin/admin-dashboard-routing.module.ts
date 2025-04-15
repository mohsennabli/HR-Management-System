import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'employees',
        loadChildren: () => import('src/app/core/features/components/employee/employee.module')
          .then(m => m.EmployeeModule)
      },
      { 
        path: '',
        component: AdminDashboardComponent,
        children: [
          { 
            path: 'users',
            loadChildren: () => import('src/app/core/features/components/user/user.module').then(m => m.UserModule)
          },
          // ... other admin routes
        ]
      }
    //   {
    //     path: 'performance',
    //     loadChildren: () => import('src/app/core/features/components/performance/performance.module')
    //       .then(m => m.PerformanceModule)
    //   },
    //   { path: '', redirectTo: 'employees', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }