export interface LeaveType {
  id: number;
  name: string;
  description: string;
  daysAllowed: number;    // ✅ camelCase
  isPaid: boolean;        // ✅ camelCase
  carryOver: boolean;
  maxCarryOver: number;
}
