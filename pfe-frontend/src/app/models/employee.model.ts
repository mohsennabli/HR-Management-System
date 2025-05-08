export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hire_date: string | Date;
  salary: number;
}
  
export interface ApiResponse<T> {
  name: string;
  success: boolean;
  message: string;
  data: T;
}