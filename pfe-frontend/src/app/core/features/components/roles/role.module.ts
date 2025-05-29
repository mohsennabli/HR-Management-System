import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleRoutingModule } from './role-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    RoleListComponent,
    RoleCreateComponent,
    RoleEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RoleRoutingModule,
    TableModule,
    ChipModule,
    ButtonModule,
    MessageModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule,
    CheckboxModule,
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class RoleModule { }