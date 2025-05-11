export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface RolesResponse extends ApiResponse<Role[]> {}
export interface RoleResponse extends ApiResponse<Role> {}