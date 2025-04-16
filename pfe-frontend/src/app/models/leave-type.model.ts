export interface LeaveType {
is_paid: boolean;
days_allowed: any;
    id: number;
    name: string;
    description: string;
    daysAllowed: number;
    isPaid: boolean;
    carryOver?: boolean;
    maxCarryOver?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }