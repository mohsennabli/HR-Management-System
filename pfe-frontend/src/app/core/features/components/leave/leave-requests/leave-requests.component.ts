// leave-requests.component.ts
import { Component, OnInit } from '@angular/core';

interface LeaveRequest {
  id: number;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss']
})
export class LeaveRequestsComponent implements OnInit {
  filters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];
  
  activeFilter = 'all';
  loading = true;
  requests: LeaveRequest[] = [];
  filteredRequests: LeaveRequest[] = [];

  ngOnInit(): void {
    // Simulate API call
    setTimeout(() => {
      this.requests = this.generateMockData();
      this.filterRequests();
      this.loading = false;
    }, 1500);
  }

  generateMockData(): LeaveRequest[] {
    return [
      {
        id: 1,
        employeeName: 'John Doe',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-20'),
        duration: 5,
        type: 'Vacation',
        status: 'PENDING'
      },
      {
        id: 2,
        employeeName: 'Jane Smith',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-04-05'),
        duration: 4,
        type: 'Sick Leave',
        status: 'APPROVED'
      },
      {
        id: 3,
        employeeName: 'Bob Johnson',
        startDate: new Date('2024-03-10'),
        endDate: new Date('2024-03-12'),
        duration: 2,
        type: 'Personal',
        status: 'REJECTED'
      }
    ];
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterRequests();
  }

  filterRequests(): void {
    if (this.activeFilter === 'all') {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(request =>
        request.status.toLowerCase() === this.activeFilter
      );
    }
  }

  openNewRequest(): void {
    // Add logic to open new request form
  }
}