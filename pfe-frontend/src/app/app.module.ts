import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { EmployeeListComponent } from './admin-dashboard/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './admin-dashboard/employee-create/employee-create.component';
import { EmployeeEditComponent } from './admin-dashboard/employee-edit/employee-edit.component';
import { AppPerformanceComponent } from './admin-dashboard/app-performance/app-performance.component';
import { SumPipe } from './pipes/sum.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    EmployeeListComponent,
    EmployeeCreateComponent,
    EmployeeEditComponent,
    AppPerformanceComponent,
    SumPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }