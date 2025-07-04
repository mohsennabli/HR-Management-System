import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from 'src/app/core/features/components/user/user-list/user-list.component';
import { UserCreateComponent } from 'src/app/core/features/components/user/user-create/user-create.component';

const routes: Routes = [
  { 
    path: '',
    component: UserListComponent,
    data: { title: 'User List' } 
  },
  { 
    path: 'create',
    component: UserCreateComponent,
    data: { title: 'Create User' } 
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }