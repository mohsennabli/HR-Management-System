export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department_id: number;
  position: string;
  hire_date: string | Date;
  salary: number;
  role_id?: number;
  user?: {
    id: number;
    email: string;
    role_id: number;
  };
}
  
export interface ApiResponse<T> {
  name: string;
  success: boolean;
  message: string;
  data: T;
}