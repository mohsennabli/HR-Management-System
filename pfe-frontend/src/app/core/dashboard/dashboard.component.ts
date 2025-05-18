import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container" [ngClass]="{'sidebar-collapsed': sidebarCollapsed}">
      <app-dashboard-sidebar [collapsed]="sidebarCollapsed" (toggleSidebar)="toggleSidebar()"></app-dashboard-sidebar>
      <div class="content" [ngClass]="{'expanded': sidebarCollapsed}">
        <div class="content-header">
          <button pButton icon="pi pi-bars" class="p-button-text sidebar-toggle" (click)="toggleSidebar()" *ngIf="isMobile"></button>
          <p-breadcrumb [model]="breadcrumbItems" [home]="homeItem" styleClass="border-none"></p-breadcrumb>
        </div>
        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .dashboard-container {
      @apply flex min-h-screen bg-white transition-all duration-300 ease-in-out overflow-hidden;
    }
    
    .content {
      @apply flex-1 ml-72 p-5 transition-all duration-300 ease-in-out bg-white;
    }

    .content.expanded {
      @apply ml-20;
    }
    
    .content-header {
      @apply flex items-center mb-4 bg-white rounded-lg shadow-sm p-3;
    }

    .content-body {
      @apply bg-white rounded-lg shadow-sm p-5 min-h-[calc(100vh-130px)];
    }

    .sidebar-toggle {
      @apply mr-2;
    }

    /* Chrome-specific fixes */
    @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .dashboard-container {
        @apply overflow-y-auto;
      }
      
      .content {
        @apply will-change-transform;
      }
    }
    
    /* Mobile responsive design */
    @media (max-width: 768px) {
      .content {
        @apply ml-0 w-full;
      }
      
      .content.expanded {
        @apply ml-0;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  sidebarCollapsed = false;
  isMobile = false;
  breadcrumbItems: any[] = [];
  homeItem: any;

  ngOnInit() {
    this.checkScreenSize();
    this.setupBreadcrumb();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setupBreadcrumb() {
    this.homeItem = { icon: 'pi pi-home', routerLink: '/' };
    // You can set up dynamic breadcrumbs based on the current route
    // using Router events and ActivatedRoute
  }
}