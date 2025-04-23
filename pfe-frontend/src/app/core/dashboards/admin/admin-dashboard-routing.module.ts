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
        loadChildren: () => import('../../shared/shared-employee.module').then(m => m.SharedEmployeeModule)
      },
      
        
      { 
        path: 'users',
        loadChildren: () => import('src/app/core/features/components/user/user.module').then(m => m.UserModule)
     },
          // ... other admin routes
          {
            path: 'roles',
            loadChildren: () => import('src/app/core/features/components/roles/role.module')
              .then(m => m.RoleModule)
          },  
          {
            path: 'permissions',
            loadChildren: () => import('src/app/core/features/components/permissions/permission.module')
              .then(m => m.PermissionModule)
          },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }