import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { WorkHours } from 'src/app/models/workhours.model';
import { AttendanceService } from 'src/app/core/features/components/Attendance/attendance.service';

@Component({
  selector: 'app-heures-travailles',
  templateUrl: './working-hours.component.html',
})
export class WorkingHoursComponent implements OnInit {
  datePipe=inject(DatePipe);
  date = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  role_id=JSON.parse(localStorage.getItem('profile')as string).role_id
  employe_id=JSON.parse(localStorage.getItem('profile')as string).id_employe
  workHour:WorkHours[]=[];
  attendenceService=inject(AttendanceService);
  // toastr=inject (ToastrService);
  ngOnInit(): void {
    this.attendenceService.getWorkHours(this.date,this.role_id!=4?null:this.employe_id).subscribe((data)=>{
      //  data.success?this.toastr.success('List Presence Chargés '):this.toastr.error('Error de l affichage');
       this.workHour=data.logOfToday[0];
    })
  }
  
}