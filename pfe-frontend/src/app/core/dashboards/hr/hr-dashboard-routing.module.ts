import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HrDashboardComponent,
    children: [
      {
        path: 'employees',
        loadChildren: () => import('../../shared/shared-employee.module').then(m => m.SharedEmployeeModule)
      },
      {
        path: 'leave',
        loadChildren: () => import('src/app/core/features/components/leave/leave.module')
          .then(m => m.LeaveModule)
      },
      {
        path: 'training',
        loadChildren: () => import('src/app/core/features/components/training/training.module')
          .then(m => m.TrainingModule)
      },
      {
        path: 'discipline',
        loadChildren: () => import('src/app/core/features/components/discipline/discipline.module')
          .then(m => m.DisciplineModule)
      },
      { path: '', redirectTo: 'employee', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrDashboardRoutingModule { }