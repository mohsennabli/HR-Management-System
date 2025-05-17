<?php

namespace App\Http\Controllers\API\Training;

use App\Http\Controllers\Controller;
use App\Models\TrainingParticipant;
use App\Models\TrainingProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TrainingParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $participants = TrainingParticipant::with(['employee', 'trainingProgram'])->get();
        return response()->json(['data' => $participants], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $programId)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
    
        // Check capacity
        $program = TrainingProgram::findOrFail($programId);
        if ($program->participants()->count() >= $program->capacity) {
            return response()->json([
                'message' => 'Training program has reached maximum capacity'
            ], 422);
        }
    
        // Check duplicate enrollment
        $exists = TrainingParticipant::where([
            'training_program_id' => $programId,
            'employee_id' => $request->employee_id
        ])->exists();
    
        if ($exists) {
            return response()->json([
                'message' => 'Employee is already enrolled in this program'
            ], 422);
        }

        // Check for overlapping training enrollments
        $hasOverlap = $this->checkOverlappingTrainingEnrollments(
            $request->employee_id,
            $program->start_date,
            $program->end_date
        );

        if ($hasOverlap) {
            return response()->json([
                'message' => 'Employee is already enrolled in another training program during this period'
            ], 422);
        }
    
        $participant = TrainingParticipant::create([
            'training_program_id' => $programId,
            'employee_id' => $request->employee_id,
            'status' => 'enrolled'
        ]);
    
        return response()->json([
            'message' => 'Employee added successfully',
            'data' => $participant
        ], 201);
    }

    /**
     * Check if an employee has any overlapping training enrollments
     *
     * @param int $employeeId
     * @param string $startDate
     * @param string $endDate
     * @return bool
     */
    private function checkOverlappingTrainingEnrollments($employeeId, $startDate, $endDate)
    {
        return TrainingParticipant::where('employee_id', $employeeId)
            ->whereHas('trainingProgram', function ($query) use ($startDate, $endDate) {
                $query->where(function ($q) use ($startDate, $endDate) {
                    // Check if new training overlaps with existing training
                    $q->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate])
                        ->orWhere(function ($q) use ($startDate, $endDate) {
                            $q->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                        });
                });
            })
            ->where('status', '!=', 'dropped') // Don't consider dropped enrollments
            ->exists();
    }

    /**
     * Get available employees for a training program
     *
     * @param int $programId
     * @return \Illuminate\Http\Response
     */
    public function getAvailableEmployees($programId)
    {
        $program = TrainingProgram::findOrFail($programId);
        
        // Get all employees who are not enrolled in any overlapping training
        $availableEmployees = \App\Models\Employee::whereDoesntHave('trainingParticipants', function ($query) use ($program) {
            $query->whereHas('trainingProgram', function ($q) use ($program) {
                $q->where(function ($q) use ($program) {
                    $q->whereBetween('start_date', [$program->start_date, $program->end_date])
                        ->orWhereBetween('end_date', [$program->start_date, $program->end_date])
                        ->orWhere(function ($q) use ($program) {
                            $q->where('start_date', '<=', $program->start_date)
                                ->where('end_date', '>=', $program->end_date);
                        });
                });
            })
            ->where('status', '!=', 'dropped');
        })->get();

        return response()->json(['data' => $availableEmployees], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $participant = TrainingParticipant::with(['employee', 'trainingProgram'])->findOrFail($id);
        return response()->json(['data' => $participant], 200);
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
        $participant = TrainingParticipant::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'training_program_id' => 'required|exists:training_programs,id',
            'employee_id' => 'required|exists:employees,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $participant->update($request->all());
        return response()->json(['data' => $participant], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $participant = TrainingParticipant::findOrFail($id);
        $participant->delete();
        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:enrolled,completed,dropped'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $participant = TrainingParticipant::findOrFail($id);
        $participant->update(['status' => $request->status]);

        return response()->json(['data' => $participant], 200);
    }
}