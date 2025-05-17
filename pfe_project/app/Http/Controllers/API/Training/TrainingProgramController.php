<?php

namespace App\Http\Controllers\API\Training;

use App\Http\Controllers\Controller;
use App\Models\TrainingProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TrainingProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $programs = TrainingProgram::with('participants.employee')->get();
        return response()->json(['data' => $programs], 200);
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
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'capacity' => 'required|integer|min:1',
            'instructor' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'status' => 'required|in:upcoming,ongoing,completed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $program = TrainingProgram::create($request->all());
        return response()->json(['data' => $program], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $program = TrainingProgram::with('participants.employee')->findOrFail($id);
        return response()->json(['data' => $program], 200);
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
        $program = TrainingProgram::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'capacity' => 'required|integer|min:1',
            'instructor' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'status' => 'required|in:upcoming,ongoing,completed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $program->update($request->all());
        return response()->json(['data' => $program], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $program = TrainingProgram::findOrFail($id);
        $program->delete();
        return response()->json(null, 204);
    }

    /**
     * Get available employees for a training program
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getAvailableEmployees(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Get all employees who are not enrolled in any overlapping training
        $availableEmployees = \App\Models\Employee::whereDoesntHave('trainingParticipants', function ($query) use ($request) {
            $query->whereHas('trainingProgram', function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    $q->whereBetween('start_date', [$request->start_date, $request->end_date])
                        ->orWhereBetween('end_date', [$request->start_date, $request->end_date])
                        ->orWhere(function ($q) use ($request) {
                            $q->where('start_date', '<=', $request->start_date)
                                ->where('end_date', '>=', $request->end_date);
                        });
                });
            })
            ->where('status', '!=', 'dropped');
        })->get();

        return response()->json(['data' => $availableEmployees], 200);
    }
}