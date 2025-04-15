export interface LeaveType {
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