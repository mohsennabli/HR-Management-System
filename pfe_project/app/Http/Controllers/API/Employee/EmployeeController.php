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
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        

        $employees = $query->get()->map(function ($employee) {
            $employeeData = $employee->toArray();
            $employeeData['email'] = $employee->user ? $employee->user->email : null;
            $employeeData['department'] = $employee->department ? $employee->department->name : null;

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
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'birth_date' => 'nullable|date',
            'birth_location' => 'nullable|string|max:255',
            'marital_status' => 'nullable|string|in:single,married,divorced,widowed',
            'has_disabled_child' => 'nullable|boolean',
            'address' => 'nullable|string',
            'diploma' => 'nullable|string|max:255',
            'cin_number' => 'nullable|string|max:255',
            'cin_issue_date' => 'nullable|date',
            'cin_issue_location' => 'nullable|string|max:255',
            'cnss_number' => 'nullable|string|max:255',
            'bank_agency' => 'nullable|string|max:255',
            'bank_rib' => 'nullable|string|max:255',
            'is_user' => 'boolean',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable|min:6',
            'role_id' => 'nullable|exists:roles,id'
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Create the employee record
            $employeeData = $request->only([
                'first_name', 'last_name', 'phone', 'department_id', 'position', 
                'hire_date', 'salary', 'birth_date', 'birth_location', 'marital_status',
                'has_disabled_child', 'address', 'diploma', 'cin_number', 'cin_issue_date',
                'cin_issue_location', 'cnss_number', 'bank_agency', 'bank_rib'
            ]);
            $employee = Employee::create($employeeData);

            // If is_user is true, create a user account
            if ($request->is_user) {
                if (!$request->email || !$request->password || !$request->role_id) {
                    return response()->json(['error' => 'Email, password, and role are required when creating a user account'], 422);
                }
                
                $user = \App\Models\User::create([
                    'name' => $employee->first_name . ' ' . $employee->last_name,
                    'email' => $request->email,
                    'password' => bcrypt($request->password),
                    'employee_id' => $employee->id,
                    'role_id' => $request->role_id
                ]);
            }

            return response()->json(['data' => $employee->fresh(['user'])], 201);

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
        $employee = Employee::with('user')->findOrFail($id);

        // Validate the request
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'position' => 'required|string|max:255',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'birth_date' => 'nullable|date',
            'birth_location' => 'nullable|string|max:255',
            'marital_status' => 'nullable|string|in:single,married,divorced,widowed',
            'has_disabled_child' => 'nullable|boolean',
            'address' => 'nullable|string',
            'diploma' => 'nullable|string|max:255',
            'cin_number' => 'nullable|string|max:255',
            'cin_issue_date' => 'nullable|date',
            'cin_issue_location' => 'nullable|string|max:255',
            'cnss_number' => 'nullable|string|max:255',
            'bank_agency' => 'nullable|string|max:255',
            'bank_rib' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . ($employee->user ? $employee->user->id : 'NULL') . ',id',
            'password' => 'nullable|min:6',
            'role_id' => 'nullable|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Update the employee data
            $employeeData = $request->only([
                'first_name', 'last_name', 'phone', 'department_id', 'position', 
                'hire_date', 'salary', 'birth_date', 'birth_location', 'marital_status',
                'has_disabled_child', 'address', 'diploma', 'cin_number', 'cin_issue_date',
                'cin_issue_location', 'cnss_number', 'bank_agency', 'bank_rib'
            ]);
            $employee->update($employeeData);

            // Handle user account update
            if ($request->has('email')) {
                if ($employee->user) {
                    // Update existing user
                    $userData = [
                        'name' => $employee->first_name . ' ' . $employee->last_name,
                        'email' => $request->email
                    ];
                    if ($request->has('password')) {
                        $userData['password'] = bcrypt($request->password);
                    }
                    if ($request->has('role_id')) {
                        $userData['role_id'] = $request->role_id;
                    }
                    $employee->user->update($userData);
                } else {
                    // Create new user account
                    $user = \App\Models\User::create([
                        'name' => $employee->first_name . ' ' . $employee->last_name,
                        'email' => $request->email,
                        'password' => bcrypt($request->password ?? 'password'),
                        'employee_id' => $employee->id,
                        'role_id' => $request->role_id
                    ]);
                }
            }

            return response()->json(['data' => $employee->fresh(['user'])], 200);

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