<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    // Get all users (Read - List)
    public function index()
    {
        $users = User::with('role')->get(); // Include role details
        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200);
    }

    // Get a single user (Read - Show)
    public function show($id)
    {
        $user = User::with('role')->find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }
        return response()->json([
            'status' => 'success',
            'data' => $user
        ], 200);
    }

    // Create a new user (Create)
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email|max:100',
                'password' => 'required|string|min:6',
                'role_id' => 'required|exists:roles,id'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password), // Hash the password
                'role_id' => $request->role_id
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    // Update an existing user (Update)
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        try {
            $request->validate([
                'name' => 'sometimes|required|string|max:100',
                'email' => 'sometimes|required|email|unique:users,email,' . $id . '|max:100',
                'password' => 'sometimes|required|string|min:6',
                'role_id' => 'sometimes|required|exists:roles,id'
            ]);

            $user->update([
                'name' => $request->input('name', $user->name),
                'email' => $request->input('email', $user->email),
                'password' => $request->has('password') ? Hash::make($request->password) : $user->password,
                'role_id' => $request->input('role_id', $user->role_id)
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    // Delete a user (Delete)
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        $user->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully'
        ], 204); // No content
    }
}