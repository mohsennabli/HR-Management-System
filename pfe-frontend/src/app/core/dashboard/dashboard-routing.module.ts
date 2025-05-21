import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminRhGuard } from 'src/app/guards/Admin-RhGuard.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../features/components/employee-profile/employee-profile.module').then(m => m.EmployeeProfileModule)
      },
      {
        path: 'employees',
        loadChildren: () => import('../features/components/employee/employee.module').then(m => m.EmployeeModule),canActivate:[AdminRhGuard ]
      },
      { 
        path: 'statistics', 
        loadChildren: () => import('../features/components/statistics-board/statistics-board.module').then(m => m.StatisticsBoardModule) ,canActivate:[AdminRhGuard ]
      },
      {
        path: 'users',
        loadChildren: () => import('../features/components/user/user.module').then(m => m.UserModule),canActivate:[AdminRhGuard ]
      },
      {
        path: 'roles',
        loadChildren: () => import('../features/components/roles/role.module').then(m => m.RoleModule),canActivate:[AdminRhGuard ]
      },
     
       {
        path: 'departments',
        loadChildren: () => import('../features/components/department/department.module').then(m => m.DepartmentsModule),canActivate:[AdminRhGuard ]
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
      {
        path: 'attendance',
        loadChildren: () => import('../features/components/Attendance/attendance.module').then(m => m.AttendanceModule)
      },
      // Default route - redirect to employees
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
      // Catch-all route - redirect to employees
      { path: '**', redirectTo: 'employees' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 