<?php

namespace App\Http\Controllers\API\Leave;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeaveTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $leaveTypes = LeaveType::all();
        return response()->json(['data' => $leaveTypes], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'days_allowed' => 'required|integer|min:1',
            'is_paid' => 'boolean',
            'carry_over' => 'boolean',
            'max_carry_over' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if leave type name already exists
        if (LeaveType::where('name', $request->name)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'A leave type with this name already exists.'
            ], 422);
        }

        $leaveType = LeaveType::create($request->all());
        return response()->json([
            'success' => true,
            'data' => $leaveType,
            'message' => 'Leave type created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $leaveType = LeaveType::findOrFail($id);
        return response()->json(['data' => $leaveType], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $leaveType = LeaveType::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'days_allowed' => 'required|integer|min:1',
            'is_paid' => 'boolean',
            'carry_over' => 'boolean',
            'max_carry_over' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leaveType->update($request->all());
        return response()->json(['data' => $leaveType], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $leaveType = LeaveType::findOrFail($id);
        $leaveType->delete();
        return response()->json(null, 204);
    }
}