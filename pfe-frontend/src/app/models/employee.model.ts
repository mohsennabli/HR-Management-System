export interface Employee {
    salary: any;
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    position: string;
    department: string;
    hire_date: string;
    status: 'active' | 'inactive';
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }