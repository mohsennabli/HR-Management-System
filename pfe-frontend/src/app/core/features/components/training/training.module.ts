import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TrainingRoutingModule } from 'src/app/core/features/components/training/training-routing.module';

import { TrainingListComponent } from 'src/app/core/features/components/training/training-list/training-list.component';
import { TrainingCreateComponent } from 'src/app/core/features/components/training/training-create/training-create.component';
import { TrainingViewComponent } from 'src/app/core/features/components/training/training-view/training-view.component';
import { TrainingEditComponent } from 'src/app/core/features/components/training/training-edit/training-edit.component';

import { TrainingProgramService } from 'src/app/core/features/components/training/training-program.service';
import { TrainingParticipantService } from 'src/app/core/features/components/training/training-participant.service';

@NgModule({
  declarations: [
    TrainingListComponent,
    TrainingCreateComponent,
    TrainingViewComponent,
    TrainingEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TrainingRoutingModule
  ],
  providers: [
    TrainingProgramService,
    TrainingParticipantService
  ]
})
export class TrainingModule { }