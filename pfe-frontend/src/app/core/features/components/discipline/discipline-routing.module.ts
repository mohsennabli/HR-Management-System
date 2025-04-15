import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisciplineListComponent } from 'src/app/core/features/components/discipline/discipline-list/discipline-list.component';

const routes: Routes = [
  { path: '', component: DisciplineListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisciplineRoutingModule { }