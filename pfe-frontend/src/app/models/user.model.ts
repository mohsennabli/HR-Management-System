export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  roles: { id: number, name: string }[]; // Changed from role_id to roles array
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  employee?: any;
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}