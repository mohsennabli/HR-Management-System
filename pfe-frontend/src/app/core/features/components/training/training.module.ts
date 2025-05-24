import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TrainingRoutingModule } from 'src/app/core/features/components/training/training-routing.module';

import { TrainingListComponent } from 'src/app/core/features/components/training/training-list/training-list.component';
import { TrainingCreateComponent } from 'src/app/core/features/components/training/training-create/training-create.component';
import { TrainingEditComponent } from 'src/app/core/features/components/training/training-edit/training-edit.component';
import { TrainingEmployeeAssignComponent } from 'src/app/core/features/components/training/training-employee-assign/training-employee-assign.component';

import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { TrainingParticipantService } from 'src/app/core/features/components/training/training-participant.service';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [
    TrainingListComponent,
    TrainingCreateComponent,
    TrainingEditComponent,
    TrainingEmployeeAssignComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TrainingRoutingModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    DynamicDialogModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    ProgressSpinnerModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    MessageModule
  ],
  providers: [
    TrainingProgramService,
    TrainingParticipantService
  ]
})
export class TrainingModule { }