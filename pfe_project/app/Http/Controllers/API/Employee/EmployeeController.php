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
        $query = Employee::query();

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

        return response()->json(['data' => $query->get()], 200);
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
        ]);

        if ($validator->fails()) {
            // Return validation errors
            Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Create the employee record
            $employeeData = $request->only(['first_name', 'last_name', 'phone', 'department', 'position', 'hire_date', 'salary']);
            $employee = Employee::create($employeeData);

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
}