import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TrainingListComponent } from 'src/app/core/features/components/training/training-list/training-list.component';
import { TrainingCreateComponent } from 'src/app/core/features/components/training/training-create/training-create.component';
import { TrainingEditComponent } from 'src/app/core/features/components/training/training-edit/training-edit.component';

const routes: Routes = [
  { path: '', component: TrainingListComponent },
  { path: 'create', component: TrainingCreateComponent },
  { path: 'edit/:id', component: TrainingEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }