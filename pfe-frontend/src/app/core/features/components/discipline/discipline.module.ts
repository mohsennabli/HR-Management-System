import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DisciplineRoutingModule } from 'src/app/core/features/components/discipline/discipline-routing.module';
import { DisciplineListComponent } from 'src/app/core/features/components/discipline/discipline-list/discipline-list.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    DisciplineListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DisciplineRoutingModule,
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    CardModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule
  ]
})
export class DisciplineModule { }