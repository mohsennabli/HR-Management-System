import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserRoutingModule } from 'src/app/core/features/components/user/user-routing.module';
import { UserListComponent } from 'src/app/core/features/components/user/user-list/user-list.component';
import { UserCreateComponent } from 'src/app/core/features/components/user/user-create/user-create.component';
import { UserEditComponent } from 'src/app/core/features/components/user/user-edit/user-edit.component';

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
    UserRoutingModule
  ]
})
export class UserModule { }