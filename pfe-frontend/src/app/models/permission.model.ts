import { ApiResponse } from "./employee.model";

export interface Permission {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface PermissionResponse extends ApiResponse<Permission> {}
  export interface PermissionsResponse extends ApiResponse<Permission[]> {}