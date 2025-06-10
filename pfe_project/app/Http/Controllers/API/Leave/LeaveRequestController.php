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
    return response()->json($requests); 
    
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
        'start_date' => 'required|date|after:today',  
        'end_date' => 'required|date|after_or_equal:start_date',
        'days' => 'required|integer|min:1',
        'reason' => 'nullable|string|max:500'
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    // Get employee and leave type
    $employee = \App\Models\Employee::findOrFail($request->employee_id);
    $leaveType = \App\Models\LeaveType::findOrFail($request->leave_type_id);

    // Check if employee is currently on leave
    $isOnLeave = $this->checkIfEmployeeOnLeave($request->employee_id);
    if ($isOnLeave) {
        return response()->json([
            'success' => false,
            'message' => 'Employee is currently on leave.'
        ], 422);
    }

    // Check minimum notice period (e.g., 3 days)
    $startDate = \Carbon\Carbon::parse($request->start_date);
    $noticePeriod = $startDate->diffInDays(now());
    if ($noticePeriod < 3) {
        return response()->json([
            'success' => false,
            'message' => 'Leave requests must be submitted at least 3 days in advance.'
        ], 422);
    }

    // Check leave balance
    $usedDays = $this->getUsedLeaveDays($request->employee_id, $request->leave_type_id);
    $remainingDays = $leaveType->days_allowed - $usedDays;
    
    if ($request->days > $remainingDays) {
        return response()->json([
            'success' => false,
            'message' => "Insufficient leave balance. You have {$remainingDays} days remaining."
        ], 422);
    }

    // Check for overlapping leave requests
    $hasOverlap = $this->checkOverlappingLeaveRequests(
        $request->employee_id,
        $request->start_date,
        $request->end_date
    );

    if ($hasOverlap) {
        return response()->json([
            'success' => false,
            'message' => 'You already have a leave request that overlaps with these dates.'
        ], 422);
    }

    // Validate date range against entered days
    $start = \Carbon\Carbon::parse($request->start_date);
    $end = \Carbon\Carbon::parse($request->end_date);
    $diffDays = $this->calculateWorkingDays($start, $end);

    if ($diffDays > $request->days) {
        return response()->json([
            'success' => false,
            'message' => 'Date range exceeds the entered number of days.'
        ], 422);
    }

    // Check maximum leave duration (e.g., 30 days)
    if ($diffDays > 30) {
        return response()->json([
            'success' => false,
            'message' => 'Maximum leave duration is 30 days.'
        ], 422);
    }

    $leaveRequest = LeaveRequest::create($request->only([
        'employee_id', 'leave_type_id', 'start_date', 'end_date', 'days', 'reason'
    ]));

    return response()->json(['success' => true, 'data' => $leaveRequest], 201);
}

/**
 * Check if there are any overlapping leave requests for the given employee and date range
 *
 * @param int $employeeId
 * @param string $startDate
 * @param string $endDate
 * @return bool
 */
private function checkOverlappingLeaveRequests($employeeId, $startDate, $endDate)
{
    return LeaveRequest::where('employee_id', $employeeId)
        ->where(function ($query) use ($startDate, $endDate) {
            $query->where(function ($q) use ($startDate, $endDate) {
                // Check if new request overlaps with existing request
                $q->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            });
        })
        ->where('status', '!=', 'rejected') 
        ->exists();
}

/**
 * Check if employee is currently on leave
 */
private function checkIfEmployeeOnLeave($employeeId)
{
    return LeaveRequest::where('employee_id', $employeeId)
        ->where('status', 'approved')
        ->where(function ($query) {
            $query->whereBetween('start_date', [now(), now()->addDays(30)])
                ->orWhereBetween('end_date', [now(), now()->addDays(30)])
                ->orWhere(function ($q) {
                    $q->where('start_date', '<=', now())
                        ->where('end_date', '>=', now());
                });
        })
        ->exists();
}

/**
 * Get used leave days for an employee for a specific leave type
 */
private function getUsedLeaveDays($employeeId, $leaveTypeId)
{
    $currentYear = now()->year;
    return LeaveRequest::where('employee_id', $employeeId)
        ->where('leave_type_id', $leaveTypeId)
        ->where('status', 'approved')
        ->whereYear('start_date', $currentYear)
        ->sum('days');
}

/**
 * Calculate working days between two dates (excluding weekends)
 */
private function calculateWorkingDays($start, $end)
{
    $days = 0;
    $current = $start->copy();

    while ($current <= $end) {
        // Skip weekends (5 = Saturday, 6 = Sunday)
        if ($current->dayOfWeek !== 5 && $current->dayOfWeek !== 6) {
            $days++;
        }
        $current->addDay();
    }

    return $days;
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