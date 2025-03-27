<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Insert roles
        Role::create(['name' => 'Admin']);
        Role::create(['name' => 'HRManager']);
        Role::create(['name' => 'Employee']);
    }
}