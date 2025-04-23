import { ApiResponse } from "./employee.model";
import { Permission } from "./permission.model";

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface RoleResponse extends ApiResponse<Role> {}
export interface RolesResponse extends ApiResponse<Role[]> {}