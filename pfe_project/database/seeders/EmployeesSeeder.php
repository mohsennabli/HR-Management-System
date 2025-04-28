<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class EmployeesSeeder extends Seeder
{
    public function run()
    {
        Employee::query()->delete();

        $users = User::whereHas('roles', function($q) {
            $q->where('name', 'employee');
        })->get();

        $departments = ['IT', 'HR', 'Finance', 'Marketing'];
        $positions = ['Developer', 'Manager', 'Analyst', 'Specialist'];

        foreach ($users as $index => $user) {
            Employee::create([
                'user_id' => $user->id,
                'first_name' => explode(' ', $user->name)[0],
                'last_name' => explode(' ', $user->name)[1] ?? '',
                'phone' => '555-010' . ($index + 1),
                'department' => $departments[$index % count($departments)],
                'position' => $positions[$index % count($positions)],
                'hire_date' => Carbon::now()->subYears(rand(1, 5)),
                'salary' => rand(50000, 90000)
            ]);
        }
    }
}