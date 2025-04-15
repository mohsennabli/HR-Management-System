import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DisciplineRoutingModule } from 'src/app/core/features/components/discipline/discipline-routing.module';
import { DisciplineListComponent } from 'src/app/core/features/components/discipline/discipline-list/discipline-list.component';

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
    
  ]
})
export class DisciplineModule { }