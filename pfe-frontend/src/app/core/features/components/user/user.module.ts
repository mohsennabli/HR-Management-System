import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserRoutingModule } from 'src/app/core/features/components/user/user-routing.module';
import { UserListComponent } from 'src/app/core/features/components/user/user-list/user-list.component';
import { UserCreateComponent } from 'src/app/core/features/components/user/user-create/user-create.component';
import { UserEditComponent } from 'src/app/core/features/components/user/user-edit/user-edit.component';


import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UserRoutingModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ProgressSpinnerModule,
    MessageModule,
    DropdownModule,
    InputTextModule,
    CardModule,
    ConfirmDialogModule,
    TooltipModule,
    ToastModule
  ]
})
export class UserModule { }