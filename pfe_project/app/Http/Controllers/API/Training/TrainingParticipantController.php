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