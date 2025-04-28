<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UsersSeeder::class,
            EmployeesSeeder::class,
            LeaveTypesSeeder::class,
            LeaveRequestsSeeder::class,
        ]);
    }
}