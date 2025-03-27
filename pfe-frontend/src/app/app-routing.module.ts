import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './pages/employee-create/employee-create.component';
import { EmployeeEditComponent } from './pages/employee-edit/employee-edit.component';
import { AppPerformanceComponent } from './pages/app-performance/app-performance.component';

const routes: Routes = [
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/create', component: EmployeeCreateComponent },
  { path: 'employees/edit/:id', component: EmployeeEditComponent },
  { path: 'app-performance', component: AppPerformanceComponent },
  { path: '', redirectTo: '/employees', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }