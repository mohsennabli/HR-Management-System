import { Component, OnInit, HostListener } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { DashboardSidebarComponent } from 'src/app/core/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- Sidebar -->
      <app-dashboard-sidebar 
        [collapsed]="sidebarCollapsed" 
        (toggleSidebar)="toggleSidebar()"
        class="fixed top-0 left-0 h-full z-30 transition-all duration-300"
        [ngClass]="{'w-72': !sidebarCollapsed, 'w-20': sidebarCollapsed}"
      ></app-dashboard-sidebar>

      <!-- Main Content -->
      <div class="flex-1 transition-all duration-300"
           [ngClass]="{'ml-72': !sidebarCollapsed, 'ml-20': sidebarCollapsed}">
        <!-- Header -->
        <header class="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
          <div class="flex items-center justify-between px-6 py-4">
            <div class="flex items-center space-x-4">
              <button 
                pButton 
                type="button"
                icon="pi pi-bars"
                class="p-button-text p-button-rounded"
                (click)="toggleSidebar()"
              ></button>
              <p-breadcrumb 
                [model]="breadcrumbItems" 
                [home]="homeItem" 
                styleClass="border-none"
              ></p-breadcrumb>
            </div>
           
          </div>
        </header>

        <!-- Content Area -->
        <main class="p-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
    BreadcrumbModule,
    RippleModule,
    DashboardSidebarComponent
  ]
})
export class DashboardComponent implements OnInit {
  sidebarCollapsed = false;
  isMobile = false;
  breadcrumbItems: any[] = [];
  homeItem: any;
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(private themeService: ThemeService) {}

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

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  setupBreadcrumb() {
    this.homeItem = { icon: 'pi pi-home', routerLink: '/' };
  }
}