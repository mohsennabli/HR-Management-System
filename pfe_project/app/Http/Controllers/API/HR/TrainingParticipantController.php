<?php

namespace App\Http\Controllers\API\HR;

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
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'training_program_id' => 'required|exists:training_programs,id',
            'employee_id' => 'required|exists:employees,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the program has reached its capacity
        $program = TrainingProgram::findOrFail($request->training_program_id);
        $currentParticipants = $program->participants()->count();

        if ($currentParticipants >= $program->capacity) {
            return response()->json([
                'error' => 'Training program has reached its maximum capacity'
            ], 422);
        }

        // Check if employee is already enrolled
        $existingEnrollment = TrainingParticipant::where([
            'training_program_id' => $request->training_program_id,
            'employee_id' => $request->employee_id
        ])->first();

        if ($existingEnrollment) {
            return response()->json([
                'error' => 'Employee is already enrolled in this training program'
            ], 422);
        }

        $participant = TrainingParticipant::create($request->all());
        return response()->json(['data' => $participant], 201);
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
