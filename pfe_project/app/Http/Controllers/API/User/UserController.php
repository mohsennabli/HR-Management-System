<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'employee'])->get();
        return response()->json(['data' => $users], 200);
    }

    public function show($id)
    {
        $user = User::with(['roles', 'employee'])->findOrFail($id);
        return response()->json(['data' => $user], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->roles()->sync($request->roles);

        // Create employee record if needed
        if ($user->roles->contains('name', 'employee')) {
            Employee::create([
                'user_id' => $user->id,
                'first_name' => explode(' ', $user->name)[0],
                'last_name' => explode(' ', $user->name)[1] ?? '',
                'hire_date' => now(),
                'salary' => 0
            ]);
        }

        return response()->json([
            'data' => $user->load(['roles', 'employee'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => "sometimes|required|email|unique:users,email,$id",
            'password' => 'sometimes|required|string|min:6',
            'roles' => 'sometimes|required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $updateData = $request->only(['name', 'email']);
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);
        $user->roles()->sync($request->roles);

        return response()->json([
            'data' => $user->load(['roles', 'employee'])
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json([
            'message' => 'User deleted successfully'
        ], 204);
    }
}