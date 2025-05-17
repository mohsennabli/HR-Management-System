<?php

namespace App\Http\Controllers\API\Role;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of roles.
     */
    public function index()
    {
        $roles = Role::all();

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
        ]);

        $role = Role::create([
            'name' => $request->name
        ]);

        return response()->json([
            'success' => true,
            'data' => $role,
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
            'data' => $role,
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
        ]);

        $role->update([
            'name' => $request->name
        ]);

        return response()->json([
            'success' => true,
            'data' => $role->fresh(),
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
