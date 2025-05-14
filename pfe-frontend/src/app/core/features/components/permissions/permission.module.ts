import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionRoutingModule } from './permission-routing.module';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionCreateComponent } from './permission-create/permission-create.component';
import { PermissionEditComponent } from './permission-edit/permission-edit.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';  
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
  declarations: [
    PermissionListComponent,
    PermissionCreateComponent,
    PermissionEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PermissionRoutingModule,
    TableModule,
    ChipModule,
    ButtonModule,
    MessageModule,
    ProgressSpinnerModule
  ]
})
export class PermissionModule { }