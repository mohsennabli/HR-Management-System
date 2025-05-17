import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentCreateComponent } from './department-create/department-create.component';
import { DepartmentEditComponent } from './department-edit/department-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentRoutingModule } from './department-routing.module';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    DepartmentListComponent,
    DepartmentCreateComponent,
    DepartmentEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DepartmentRoutingModule,
    // PrimeNG Modules
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    CardModule,
    RippleModule,
    TooltipModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class DepartmentsModule { }
