<?php

namespace App\Http\Controllers\API\Leave;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeaveRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
 public function index()
{
    $requests = LeaveRequest::with(['employee', 'leaveType'])->get();
    return response()->json($requests); // Remove the 'data' wrapper if not needed
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
        'employee_id' => 'required|exists:employees,id',
        'leave_type_id' => 'required|exists:leave_types,id',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after_or_equal:start_date',
        'days' => 'required|integer|min:1',
        'reason' => 'nullable|string'
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    // Check logique sécurité API
    $start = \Carbon\Carbon::parse($request->start_date);
    $end = \Carbon\Carbon::parse($request->end_date);
    $diffDays = $start->diffInDays($end) + 1;

    if ($diffDays > $request->days) {
        return response()->json(['success' => false, 'message' => 'Date range cannot exceed entered days.'], 422);
    }

    $leaveRequest = LeaveRequest::create($request->only([
        'employee_id', 'leave_type_id', 'start_date', 'end_date', 'days', 'reason'
    ]));

    return response()->json(['success' => true, 'data' => $leaveRequest], 201);
}


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $leaveRequest = LeaveRequest::with(['employee', 'leaveType'])->findOrFail($id);
        return response()->json(['data' => $leaveRequest], 200);
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
        $leaveRequest = LeaveRequest::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'days' => 'required|integer|min:1',
            'reason' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leaveRequest->update($request->all());
        return response()->json(['data' => $leaveRequest], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->delete();
        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'status' => 'required|in:pending,approved,rejected'
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $leaveRequest = LeaveRequest::findOrFail($id);

    // Prevent updating status if it's already approved or rejected
    if (in_array($leaveRequest->status, ['approved', 'rejected'])) {
        return response()->json(['error' => 'This leave request status cannot be changed.'], 400);
    }

    $leaveRequest->update(['status' => $request->status]);

    return response()->json(['data' => $leaveRequest], 200);
}


    public function employeeLeaveRequests($employeeId)
{
    $employee = Employee::find($employeeId);

    if (!$employee) {
        return response()->json(['message' => 'Unknown Employee'], 404);
    }

    // Return employee name along with the leave requests
    $leaveRequests = $employee->leaveRequests;
    return response()->json([
        'data' => $leaveRequests,
        'employee_name' => $employee->first_name . ' ' . $employee->last_name
    ], 200);
}

}