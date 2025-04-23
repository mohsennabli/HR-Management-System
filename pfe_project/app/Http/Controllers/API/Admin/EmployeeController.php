<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['user', 'user.roles']);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhere('phone', 'like', "%{$search}%");
        }

        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        return response()->json(['data' => $query->get()], 200);
    }

    public function store(Request $request)
    {
        Log::info('Employee store called', $request->all());

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'department' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Create user first
            $user = User::create([
                'name' => $request->first_name.' '.$request->last_name,
                'email' => $request->email,
                'password' => Hash::make('password') // Default password
            ]);

            // Assign employee role
            $employeeRole = Role::where('name', 'employee')->first();
            $user->roles()->attach($employeeRole);

            // Create employee
            $employeeData = $request->all();
            $employeeData['user_id'] = $user->id;
            $employee = Employee::create($employeeData);

            return response()->json(['data' => $employee->load('user')], 201);

        } catch (\Exception $e) {
            Log::error('Employee creation failed: '.$e->getMessage());
            return response()->json(['error' => 'Employee creation failed'], 500);
        }
    }

    public function show($id)
    {
        $employee = Employee::with(['user', 'user.roles'])->findOrFail($id);
        return response()->json(['data' => $employee], 200);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::with('user')->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$employee->user_id,
            'phone' => 'required|string|max:20',
            'department' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Update user email
            $employee->user->update(['email' => $request->email]);
            
            // Update employee data
            $employee->update($request->except('email'));

            return response()->json(['data' => $employee->refresh()->load('user')], 200);

        } catch (\Exception $e) {
            Log::error('Employee update failed: '.$e->getMessage());
            return response()->json(['error' => 'Employee update failed'], 500);
        }
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        
        try {
            // Delete associated user
            $employee->user()->delete();
            $employee->delete();
            
            return response()->json(null, 204);
            
        } catch (\Exception $e) {
            Log::error('Employee deletion failed: '.$e->getMessage());
            return response()->json(['error' => 'Deletion failed'], 500);
        }
    }
}