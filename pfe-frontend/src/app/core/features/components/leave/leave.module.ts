import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveCreateComponent } from './leave-create/leave-create.component';
import { LeaveEditComponent } from './leave-edit/leave-edit.component';
import { LeaveRequestsComponent } from 'src/app/core/features/components/leave/leave-requests/leave-requests.component';
import { LeaveRoutingModule } from 'src/app/core/features/components/leave/leave-routing.module';
import { EmployeeLeaveRequestFormComponent } from './employee-leave-form/employee-leave-request-form.component';

@NgModule({
  declarations: [
    LeaveListComponent,
    LeaveCreateComponent,
    LeaveEditComponent,
    LeaveRequestsComponent,
    EmployeeLeaveRequestFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LeaveRoutingModule
  ],
  exports: [
    LeaveListComponent
  ]
})
export class LeaveModule { }