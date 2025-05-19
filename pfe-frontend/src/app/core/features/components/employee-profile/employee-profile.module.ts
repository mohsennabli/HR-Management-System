import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeProfileComponent } from './employee-profile.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { StepsModule } from 'primeng/steps';

const routes: Routes = [
  {
    path: '',
    component: EmployeeProfileComponent
  }
];

@NgModule({
  declarations: [
    EmployeeProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProgressSpinnerModule,
    ToastModule,
    CardModule,
    DividerModule,
    TagModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    StepsModule
  ]
})
export class EmployeeProfileModule { } 