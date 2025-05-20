<?php

namespace App\Http\Controllers\API\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserCredentialsMail;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('role')->get(); // Ensure 'role' relationship is loaded

        return response()->json([
            'data' => $users
        ], 200);
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
            'role_id' => 'required|exists:roles,id',
        ]);

        // Generate a secure random password
        $password = Str::random(12);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($password),
            'role_id' => $request->role_id,
        ]);

        if ($user->role && $user->role->name === 'employee') {
            Employee::create([
                'user_id' => $user->id,
                'first_name' => explode(' ', $user->name)[0],
                'last_name' => explode(' ', $user->name)[1] ?? '',
                'hire_date' => now(),
                'salary' => 0,
            ]);
        }

        // Send email with credentials
        Mail::to($user->email)->send(new UserCredentialsMail($user->email, $password));

        return response()->json([
            'data' => $user->load(['role', 'employee']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => "sometimes|required|email|unique:users,email,$id",
            'password' => 'sometimes|required|string|min:6',
            'role_id' => 'sometimes|required|exists:roles,id',
        ]);

        $updateData = $request->only(['name', 'email', 'role_id']);
        
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        return response()->json([
            'data' => $user->load(['role', 'employee'])
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json([
            'message' => 'User deleted successfully'
        ], 200);
    }
}