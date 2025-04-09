import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { HrDashboardComponent } from './hr-dashboard.component';
import { HrSidebarComponent } from './components/hr-sidebar/hr-sidebar.component';

// Employee Components
import { HrEmployeeListComponent } from './components/employee/hr-employee-list/hr-employee-list.component';
import { HrEmployeeCreateComponent } from './components/employee/hr-employee-create/hr-employee-create.component';
import { HrEmployeeEditComponent } from './components/employee/hr-employee-edit/hr-employee-edit.component';

// Leave Components
import { HrLeaveListComponent } from './components/leave/hr-leave-list/hr-leave-list.component';
import { HrLeaveCreateComponent } from './components/leave/hr-leave-create/hr-leave-create.component';
import { HrLeaveEditComponent } from './components/leave/hr-leave-edit/hr-leave-edit.component';
import { HrLeaveRequestsComponent } from './components/leave/hr-leave-requests/hr-leave-requests.component';
import { HrLeaveTypeCreateComponent } from './components/leave/hr-leave-type-create/hr-leave-type-create.component';

// Training Components
import { HrTrainingListComponent } from './components/training/hr-training-list/hr-training-list.component';
import { HrTrainingCreateComponent } from './components/training/hr-training-create/hr-training-create.component';
import { HrTrainingEditComponent } from './components/training/hr-training-edit/hr-training-edit.component';
import { HrTrainingViewComponent } from './components/training/hr-training-view/hr-training-view.component';
// Discipline Components
import { HrDisciplineListComponent } from './components/discipline/hr-discipline-list/hr-discipline-list.component';
import { HrDisciplineService } from 'src/app/services/hr/discipline.service';





import { HrDashboardRoutingModule } from './hr-dashboard-routing.module';

@NgModule({
  declarations: [
    HrDashboardComponent,
    HrSidebarComponent,
    HrEmployeeListComponent,
    HrEmployeeCreateComponent,
    HrEmployeeEditComponent,
    HrLeaveListComponent,
    HrLeaveCreateComponent,
    HrLeaveEditComponent,
    HrLeaveRequestsComponent,
    HrLeaveTypeCreateComponent,
    HrTrainingListComponent,
    HrTrainingCreateComponent,
    HrTrainingEditComponent,
    HrTrainingViewComponent,
    HrDisciplineListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    HrDashboardRoutingModule
  ],
  exports: [
    HrDashboardComponent
  ]
})
export class HrDashboardModule { } 