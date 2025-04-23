<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        $permissions = [
            'view_users', 'create_users', 'edit_users', 'delete_users',
            'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
            'view_permissions', 'create_permissions', 'edit_permissions', 'delete_permissions',
            // Add more permissions as needed
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles
        $roles = [
            'admin' => [
                'view_users', 'create_users', 'edit_users', 'delete_users',
                'view_roles', 'create_roles', 'edit_roles', 'delete_roles',
                'view_permissions', 'create_permissions', 'edit_permissions', 'delete_permissions',
            ],
            'hr_manager' => [
                'view_users', 'create_users', 'edit_users',
                'view_roles',
                'view_permissions',
            ],
            'employee' => [
                'view_users',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::create(['name' => $roleName]);
            
            // Attach permissions to role
            $permissionIds = Permission::whereIn('name', $rolePermissions)->pluck('id');
            $role->permissions()->attach($permissionIds);
        }
    }
}