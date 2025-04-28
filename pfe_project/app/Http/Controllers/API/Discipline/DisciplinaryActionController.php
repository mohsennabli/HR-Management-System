<?php

namespace App\Http\Controllers\API\Discipline;

use App\Http\Controllers\Controller;
use App\Models\DisciplinaryAction;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DisciplinaryActionController extends Controller
{
    public function index()
    {
        $actions = DisciplinaryAction::with('employee')->latest()->get();
        return response()->json(['data' => $actions], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'type' => 'required|in:verbal_warning,written_warning,suspension,termination',
            'reason' => 'required|string|max:500',
            'action_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $action = DisciplinaryAction::create($request->all());
        return response()->json(['data' => $action], 201);
    }

    public function getEmployees()
{
    try {
        $employees = Employee::select('id', 'first_name', 'last_name', 'position')->get();
        return response()->json(['data' => $employees], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to fetch employees'], 500);
    }
}

public function destroy($id)
    {
        try {
            $action = DisciplinaryAction::findOrFail($id);
            $action->delete();
            
            return response()->json([
                'data' => [
                    'message' => 'Disciplinary action deleted successfully',
                    'id' => $id
                ]
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete disciplinary action',
                'message' => $e->getMessage()
            ], 500);
        }
    }

}