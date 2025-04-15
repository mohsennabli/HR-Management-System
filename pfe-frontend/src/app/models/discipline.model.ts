export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
    department: string;
  }
  
  export type DisciplinaryActionType = 
    'verbal_warning' | 
    'written_warning' | 
    'suspension' | 
    'termination';
  
  export interface DisciplinaryAction {
    id?: number;
    employee_id: number;
    employee?: Employee;
    type: DisciplinaryActionType;
    reason: string;
    action_date: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
  }