import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AdminRhGuard } from 'src/app/guards/Admin-RhGuard.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'profile',    loadChildren: () => import('../features/components/employee-profile/employee-profile.module').then(m => m.EmployeeProfileModule) },
      { path: 'employees',  canActivate: [AdminRhGuard], loadChildren: () => import('../features/components/employee/employee.module').then(m => m.EmployeeModule) },
      { path: 'statistics', canActivate: [AdminRhGuard], loadChildren: () => import('../features/components/statistics-board/statistics-board.module').then(m => m.StatisticsBoardModule) },
      { path: 'users',      canActivate: [AdminRhGuard], loadChildren: () => import('../features/components/user/user.module').then(m => m.UserModule) },
      { path: 'roles',      canActivate: [AdminRhGuard], loadChildren: () => import('../features/components/roles/role.module').then(m => m.RoleModule) },
      { path: 'departments',canActivate: [AdminRhGuard], loadChildren: () => import('../features/components/department/department.module').then(m => m.DepartmentsModule) },
      { path: 'leave',      loadChildren: () => import('../features/components/leave/leave.module').then(m => m.LeaveModule) },
      { path: 'training',   loadChildren: () => import('../features/components/training/training.module').then(m => m.TrainingModule) },
      { path: 'discipline', loadChildren: () => import('../features/components/discipline/discipline.module').then(m => m.DisciplineModule) },
      { path: 'contracts',  loadChildren: () => import('../features/components/contract/contract.module').then(m => m.ContractModule) },
      { path: 'attendance', loadChildren: () => import('../features/components/Attendance/attendance.module').then(m => m.AttendanceModule) },

      // Defaults
      { path: '',   redirectTo: 'employees', pathMatch: 'full' },
      { path: '**', redirectTo: 'employees' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }