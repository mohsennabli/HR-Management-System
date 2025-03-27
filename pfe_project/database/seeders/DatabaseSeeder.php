<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class DatabaseSeeder extends Seeder {
    public function run() {
        // Seed roles with IDs 1, 2, 3
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'HRManager']);
        Role::create(['name' => 'Employee']);
    }
}