import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveListComponent } from 'src/app/core/features/components/leave/leave-list/leave-list.component';
import { LeaveCreateComponent } from './leave-create/leave-create.component';
import { LeaveEditComponent } from './leave-edit/leave-edit.component';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';
import { EmployeeLeaveRequestFormComponent } from './employee-leave-form/employee-leave-request-form.component';

const routes: Routes = [
  { path: '', component: LeaveListComponent },
  { path: 'create', component: LeaveCreateComponent },
  { path: 'edit/:id', component: LeaveEditComponent },
  { path: 'requests', component: LeaveRequestsComponent },
  { path: 'request', component: EmployeeLeaveRequestFormComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaveRoutingModule { }