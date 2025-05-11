<?php

namespace App\Http\Controllers\API\Role;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index()
{
    $roles = Role::all(); // Ensure all roles are returned

    if ($roles->isEmpty()) {
        return response()->json([
            'message' => 'No roles found.'
        ], 404);
    }

    return response()->json([
        'data' => $roles
    ], 200);
}
    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role = Role::create([
            'name' => $request->name
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->attach($request->permissions);
        }

        return response()->json([
            'success' => true,
            'data' => $role->load('permissions'),
            'message' => 'Role created successfully'
        ], 201);
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role)
    {
        return response()->json([
            'success' => true,
            'data' => $role->load('permissions'),
            'message' => 'Role retrieved successfully'
        ]);
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role->update([
            'name' => $request->name
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'success' => true,
            'data' => $role->fresh()->load('permissions'),
            'message' => 'Role updated successfully'
        ]);
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role)
    {
        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully'
        ]);
    }
}