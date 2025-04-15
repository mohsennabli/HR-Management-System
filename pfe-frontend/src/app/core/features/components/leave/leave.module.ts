import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveCreateComponent } from './leave-create/leave-create.component';
import { LeaveEditComponent } from './leave-edit/leave-edit.component';
import { LeaveRequestsComponent } from 'src/app/core/features/components/leave/leave-requests/leave-requests.component';
import { LeaveRoutingModule } from 'src/app/core/features/components/leave/leave-routing.module';

@NgModule({
  declarations: [
    LeaveListComponent,
    LeaveCreateComponent,
    LeaveEditComponent,
    LeaveRequestsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LeaveRoutingModule
  ],
  exports: [
    LeaveListComponent // If you want to use this component elsewhere
  ]
})
export class LeaveModule { }