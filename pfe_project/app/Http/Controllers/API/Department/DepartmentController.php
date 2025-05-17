<?php

namespace App\Http\Controllers\API\Department;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    // Display all departments
    public function index()
    {
        $departments = Department::all();
        return response()->json(['data' => $departments], 200);
    }

    // Store a new department
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:departments,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $department = Department::create($request->all());
        return response()->json(['data' => $department], 201);
    }

    // Show a single department and its employees
    public function show($id)
    {
        $department = Department::with('employees')->findOrFail($id);
        return response()->json($department);
    }

    // Update a department
    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $id,
        ]);

        $department->update([
            'name' => $request->name,
        ]);

        return response()->json($department);
    }

    // Delete a department
    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return response()->json(null, 204);
    }
}
