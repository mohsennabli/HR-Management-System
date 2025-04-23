<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Permission::with('roles')->get()
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name'
        ]);

        $permission = Permission::create($request->only('name'));
        return response()->json([
            'data' => $permission
        ], 201);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Permission::with('roles')->findOrFail($id)
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $request->validate([
            'name' => "required|string|unique:permissions,name,$id"
        ]);

        $permission->update($request->only('name'));
        return response()->json([
            'data' => $permission
        ], 200);
    }

    public function destroy($id)
    {
        Permission::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}