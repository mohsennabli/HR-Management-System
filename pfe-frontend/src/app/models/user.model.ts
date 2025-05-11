import { Role } from "./role.model";

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string; // Mark as optional since you might not always need it
  role_id?: number | null;
  role?: {
    id: number;
    name: string;
  };
  // Add role_name if your backend might return it
  role_name?: string; 
}
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}