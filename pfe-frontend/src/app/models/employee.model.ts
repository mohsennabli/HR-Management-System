export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department_id: number;
  department?: {
    id: number;
    name: string;
  };
  position: string;
  hire_date: string | Date;
  salary: number;
  role_id?: number;
  birth_date?: string | Date;
  birth_location?: string;
  marital_status?: string;
  has_disabled_child?: boolean;
  address?: string;
  diploma?: string;
  cin_number?: string;
  cin_issue_date?: string | Date;
  cin_issue_location?: string;
  cnss_number?: string;
  bank_agency?: string;
  bank_rib?: string;
  is_user?: boolean;
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
  email_status?: {
    sent: boolean;
    email: string;
  };
}