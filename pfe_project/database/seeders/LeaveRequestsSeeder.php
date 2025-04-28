<?php

namespace Database\Seeders;

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class LeaveRequestsSeeder extends Seeder
{
    public function run()
    {
        LeaveRequest::query()->delete();

        $employees = Employee::all();
        $leaveTypes = LeaveType::all();

        $statuses = ['pending', 'approved', 'rejected'];

        foreach ($employees as $employee) {
            foreach ($leaveTypes as $leaveType) {
                $startDate = Carbon::now()->addDays(rand(1, 30));
                $endDate = $startDate->copy()->addDays(rand(1, $leaveType->days_allowed));
                
                LeaveRequest::create([
                    'employee_id' => $employee->id,
                    'leave_type_id' => $leaveType->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'days' => $endDate->diffInDays($startDate) + 1,
                    'status' => $statuses[array_rand($statuses)],
                    'reason' => $this->getRandomReason($leaveType->name)
                ]);
            }
        }
    }

    protected function getRandomReason($leaveType)
    {
        $reasons = [
            'Annual Leave' => ['Family vacation', 'Personal time off', 'Travel'],
            'Sick Leave' => ['Flu', 'Medical procedure', 'Doctor appointment'],
            'Maternity Leave' => ['Childbirth', 'Parental leave'],
            'Unpaid Leave' => ['Personal matters', 'Family emergency']
        ];

        return $reasons[$leaveType][array_rand($reasons[$leaveType])];
    }
}