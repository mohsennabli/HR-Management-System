import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/features/components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from 'src/app/guards/no-auth.guard';

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [NoAuthGuard] // Prevent access to login if already authenticated
  },
  
  // Protected routes
  {
    path: 'dashboard',
    loadChildren: () => import('./core/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },

  // Default route - redirect to dashboard if authenticated, login if not
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Catch-all route - redirect to dashboard if authenticated, login if not
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }