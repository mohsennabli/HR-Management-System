<?php

namespace App\Http\Controllers\API\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with('user');

        // Filter by search term
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by department
        if ($request->has('department')) {
            $query->where('department', $request->department);
        }

        $employees = $query->get()->map(function ($employee) {
            $employeeData = $employee->toArray();
            $employeeData['email'] = $employee->user ? $employee->user->email : null;
            return $employeeData;
        });

        return response()->json(['data' => $employees], 200);
    }

    public function store(Request $request)
    {
        Log::info('Incoming request:', $request->all());

        // Validate the request
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'department' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'is_user' => 'boolean',
            'email' => 'required_if:is_user,true|email|unique:users,email',
            'password' => 'required_if:is_user,true|min:6',
            'role_id' => 'required_if:is_user,true|exists:roles,id'
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Create the employee record
            $employeeData = $request->only(['first_name', 'last_name', 'phone', 'department', 'position', 'hire_date', 'salary']);
            $employee = Employee::create($employeeData);

            // If is_user is true, create a user account
            if ($request->is_user) {
                $user = \App\Models\User::create([
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),
                    'employee_id' => $employee->id,
                    'role_id' => $request->role_id
                ]);
            }

            return response()->json(['data' => $employee], 201);

        } catch (\Exception $e) {
            Log::error('Employee creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Employee creation failed'], 500);
        }
    }

    public function show($id)
    {
        $employee = Employee::findOrFail($id);
        return response()->json(['data' => $employee], 200);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        // Validate the request
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'department' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Update the employee data
            $employee->update($request->all());

            return response()->json(['data' => $employee->refresh()], 200);

        } catch (\Exception $e) {
            Log::error('Employee update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Employee update failed'], 500);
        }
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);

        try {
            $employee->delete();

            return response()->json(null, 204);

        } catch (\Exception $e) {
            Log::error('Employee deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Deletion failed'], 500);
        }
    }

    public function getRoles()
    {
        $roles = \App\Models\Role::all();
        return response()->json(['data' => $roles], 200);
    }
}