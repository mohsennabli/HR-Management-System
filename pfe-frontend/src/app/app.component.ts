import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AttendanceService } from './core/features/components/Attendance/attendance.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-50">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private attendanceService = inject(AttendanceService);
  private router = inject(Router);

  ngOnInit(): void {
    // Only synchronize attendance when navigating to dashboard
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd),
      filter((event: NavigationEnd) => event.url === '/dashboard'),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.synchronizeAttendance();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private synchronizeAttendance(): void {
    this.attendanceService.synchroniseAttendance()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (error) => console.error('Attendance synchronization failed:', error)
      });
  }
}