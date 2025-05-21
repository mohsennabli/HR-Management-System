import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { WorkingHoursComponent } from './working-hours/working-hours.component';
const routes: Routes = [
 { path: '', component: AttendanceListComponent },
 { path: 'workinghours', component: WorkingHoursComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }