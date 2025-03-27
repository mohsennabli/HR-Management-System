export interface User {
  id?: number; // Make id optional
  name: string;
  email: string;
  password?: string;
  role_id: number;
  role?: { id: number; name: string };
}