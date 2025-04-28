<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveTypesSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Clear tables in correct order
        DB::table('leave_requests')->delete();
        LeaveType::query()->delete();
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $types = [
            [
                'name' => 'Annual Leave',
                'description' => 'Paid time off work',
                'days_allowed' => 20,
                'is_paid' => true
            ],
            [
                'name' => 'Sick Leave',
                'description' => 'Medical leave for health reasons',
                'days_allowed' => 10,
                'is_paid' => true
            ],
            [
                'name' => 'Maternity Leave',
                'description' => 'Leave for new parents',
                'days_allowed' => 90,
                'is_paid' => true
            ],
            [
                'name' => 'Unpaid Leave',
                'description' => 'Personal leave without pay',
                'days_allowed' => 15,
                'is_paid' => false
            ]
        ];

        foreach ($types as $type) {
            LeaveType::create($type);
        }
    }
}