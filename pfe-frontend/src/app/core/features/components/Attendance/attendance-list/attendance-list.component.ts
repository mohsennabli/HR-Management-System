import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Attendance } from 'src/app/models/attendance.model';
import { AttendanceService } from 'src/app/core/features/components/Attendance/attendance.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.component.html',
})
export class AttendanceListComponent implements OnInit {
attendances: Attendance[] = [];
  isLoading = false;
  errorMessage = '';
  selectedDate: string;
  selectedUserId: string ='';

  constructor(
    private attendanceService: AttendanceService,
    private datePipe: DatePipe
  ) {
    this.selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }

  ngOnInit(): void {
    this.loadAttendances();
  }

  loadAttendances(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.attendanceService.getTodayAttendances(this.selectedDate, this.selectedUserId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.attendances = response.logOfToday;
          } else {
            this.errorMessage = 'Erreur lors du chargement des pointages';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur de connexion au serveur';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  onDateChange(date: string): void {
    this.selectedDate = date;
    this.loadAttendances();
  }

  onUserFilter(userId: string): void {
    this.selectedUserId = userId;
    this.loadAttendances();
  }
  getTypeLabel(type: number): string {
    switch(type) {
    case 0: return 'Entrée';
    case 1: return 'Sortie';
    case 2: return 'Pause';
    default: return 'Inconnu';
  }
}
  
}