import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'employees',
        loadChildren: () => import('../features/components/employee/employee.module').then(m => m.EmployeeModule)
      },
      { 
        path: 'statistics', 
        loadChildren: () => import('../features/components/statistics-board/statistics-board.module').then(m => m.StatisticsBoardModule) 
      },
      {
        path: 'users',
        loadChildren: () => import('../features/components/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'roles',
        loadChildren: () => import('../features/components/roles/role.module').then(m => m.RoleModule)
      },
      {
        path: 'permissions',
        loadChildren: () => import('../features/components/permissions/permission.module').then(m => m.PermissionModule)
      },
       {
        path: 'departments',
        loadChildren: () => import('../features/components/department/department.module').then(m => m.DepartmentsModule)
      },
      {
        path: 'leave',
        loadChildren: () => import('../features/components/leave/leave.module').then(m => m.LeaveModule)
      },
      {
        path: 'training',
        loadChildren: () => import('../features/components/training/training.module').then(m => m.TrainingModule)
      },
      {
        path: 'discipline',
        loadChildren: () => import('../features/components/discipline/discipline.module').then(m => m.DisciplineModule)
      },
      {
        path: 'contracts',
        loadChildren: () => import('../features/components/contract/contract.module').then(m => m.ContractModule)
      },
      //{ path: '', redirectTo: 'employees', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 