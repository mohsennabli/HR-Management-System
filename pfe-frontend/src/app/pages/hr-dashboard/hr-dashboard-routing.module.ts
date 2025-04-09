import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrDashboardComponent } from './hr-dashboard.component';

// Employee Routes
import { HrEmployeeListComponent } from './components/employee/hr-employee-list/hr-employee-list.component';
import { HrEmployeeCreateComponent } from './components/employee/hr-employee-create/hr-employee-create.component';
import { HrEmployeeEditComponent } from './components/employee/hr-employee-edit/hr-employee-edit.component';

// Leave Routes
import { HrLeaveListComponent } from './components/leave/hr-leave-list/hr-leave-list.component';
import { HrLeaveCreateComponent } from './components/leave/hr-leave-create/hr-leave-create.component';
import { HrLeaveEditComponent } from './components/leave/hr-leave-edit/hr-leave-edit.component';
import { HrLeaveRequestsComponent } from './components/leave/hr-leave-requests/hr-leave-requests.component';
import { HrLeaveTypeCreateComponent } from './components/leave/hr-leave-type-create/hr-leave-type-create.component';

// Training Routes
import { HrTrainingListComponent } from './components/training/hr-training-list/hr-training-list.component';
import { HrTrainingCreateComponent } from './components/training/hr-training-create/hr-training-create.component';
import { HrTrainingEditComponent } from './components/training/hr-training-edit/hr-training-edit.component';
import { HrTrainingViewComponent } from './components/training/hr-training-view/hr-training-view.component';
// Discipline Routes
import { HrDisciplineListComponent } from 'src/app/pages/hr-dashboard/components/discipline/hr-discipline-list/hr-discipline-list.component';
const routes: Routes = [
  {
    path: '',
    component: HrDashboardComponent,
    children: [
      // Employee Management Routes
      { path: 'employee', component: HrEmployeeListComponent },
      { path: 'employee/create', component: HrEmployeeCreateComponent },
      { path: 'employee/edit/:id', component: HrEmployeeEditComponent },
      
      // Leave Management Routes
      { path: 'leave', component: HrLeaveListComponent },
      { path: 'leave/create', component: HrLeaveTypeCreateComponent },
      { path: 'leave/edit/:id', component: HrLeaveEditComponent },
      { path: 'leave/requests', component: HrLeaveRequestsComponent },
      { path: 'leave/type/create', component: HrLeaveTypeCreateComponent },
      
      // Training Management Routes
      { path: 'training', component: HrTrainingListComponent },
      { path: 'training/create', component: HrTrainingCreateComponent },
      { path: 'training/edit/:id', component: HrTrainingEditComponent },
      { path: 'training/view/:id', component: HrTrainingViewComponent },
      // Discipline Management Routes
      { path: 'discipline', component: HrDisciplineListComponent },
      // Default route
      { path: '', redirectTo: 'employee', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrDashboardRoutingModule { } 