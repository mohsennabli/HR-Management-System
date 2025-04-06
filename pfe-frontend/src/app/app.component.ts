import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-sidebar *ngIf="showAdminSidebar"></app-sidebar>
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: transparent;
    }
    .main-content {
      flex: 1;
      padding: 20px;
      background: transparent;
    }
  `]
})
export class AppComponent {
  title = 'pfe-frontend';
  showAdminSidebar = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide admin sidebar on HR dashboard routes
      this.showAdminSidebar = !event.url.includes('/hr-dashboard');
    });
  }
}
