import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './admin-dashboard/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './admin-dashboard/employee-create/employee-create.component';
import { EmployeeEditComponent } from './admin-dashboard/employee-edit/employee-edit.component';
import { AppPerformanceComponent } from './admin-dashboard/app-performance/app-performance.component';

const routes: Routes = [
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/create', component: EmployeeCreateComponent },
  { path: 'employees/edit/:id', component: EmployeeEditComponent },
  { path: 'app-performance', component: AppPerformanceComponent },
  { 
    path: 'hr-dashboard', 
    loadChildren: () => import('./pages/hr-dashboard/hr-dashboard.module').then(m => m.HrDashboardModule)
  },
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: '**', redirectTo: '/employees' } // Handle 404 - redirect to employees page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }