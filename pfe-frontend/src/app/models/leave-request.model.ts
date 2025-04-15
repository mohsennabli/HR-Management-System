export interface Employee {
    id: number;
    name: string;
    email?: string;
    department?: string;
    position?: string;
  }
  
  export interface LeaveType {
    id: number;
    name: string;
    isPaid: boolean;
    daysAllowed?: number;
  }
  
  export enum LeaveStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled'
  }
  
  export interface LeaveRequest {
    id: number;
    employee: Employee;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    daysRequested: number;
    status: LeaveStatus;
    reason: string;
    notes?: string;
    approvedBy?: Employee;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
  }
  
  // For form submission
  export interface CreateLeaveRequest {
    leaveTypeId: number;
    startDate: Date;
    endDate: Date;
    reason: string;
    notes?: string;
    attachments?: File[];
  }
  
  // For filters/pagination
  export interface LeaveRequestQueryParams {
    status?: LeaveStatus;
    employeeId?: number;
    leaveTypeId?: number;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }