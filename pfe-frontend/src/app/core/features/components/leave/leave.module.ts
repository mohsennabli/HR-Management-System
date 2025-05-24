import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveEditComponent } from './leave-edit/leave-edit.component';
import { LeaveRequestsComponent } from 'src/app/core/features/components/leave/leave-requests/leave-requests.component';
import { LeaveRoutingModule } from 'src/app/core/features/components/leave/leave-routing.module';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    LeaveListComponent,
    LeaveEditComponent,
    LeaveRequestsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LeaveRoutingModule,
    RouterModule,
    // PrimeNG Modules
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    CalendarModule,
    ToastModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    CardModule,
    TagModule,
    TooltipModule
  ],
  exports: [
    LeaveListComponent,
    LeaveEditComponent,
    LeaveRequestsComponent
  ]
})
export class LeaveModule { }