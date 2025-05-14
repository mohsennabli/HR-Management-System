import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TrainingRoutingModule } from 'src/app/core/features/components/training/training-routing.module';

import { TrainingListComponent } from 'src/app/core/features/components/training/training-list/training-list.component';
import { TrainingCreateComponent } from 'src/app/core/features/components/training/training-create/training-create.component';
import { TrainingEditComponent } from 'src/app/core/features/components/training/training-edit/training-edit.component';

import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { TrainingParticipantService } from 'src/app/core/features/components/training/training-participant.service';


import { ToastModule } from 'primeng/toast'; // Import the ToastModule from PrimeNG
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Import the module for p-confirmDialog
import { ButtonModule } from 'primeng/button'; // Import the ButtonModule from PrimeNG
@NgModule({
  declarations: [
    TrainingListComponent,
    TrainingCreateComponent,
    TrainingEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TrainingRoutingModule,
    ToastModule,
    ConfirmDialogModule ,
    ButtonModule
  ],
  providers: [
    TrainingProgramService,
    TrainingParticipantService
  ]
})
export class TrainingModule { }