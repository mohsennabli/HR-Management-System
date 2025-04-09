<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Admin\UserController;
use App\Http\Controllers\API\Admin\PerformanceController;
use App\Http\Controllers\API\HR\EmployeeController;
use App\Http\Controllers\API\HR\LeaveTypeController;
use App\Http\Controllers\API\HR\LeaveRequestController;
use App\Http\Controllers\API\HR\TrainingProgramController;
use App\Http\Controllers\API\HR\TrainingParticipantController;
use App\Http\Controllers\API\HR\DisciplinaryActionController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::prefix('admin')->group(function () {
    Route::apiResource('users', UserController::class);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::prefix('admin')->group(function () {
    Route::get('/performance', [PerformanceController::class, 'index']);
});

// HR Dashboard API Routes
Route::prefix('hr')->group(function () {
    // Employee Routes
    Route::apiResource('employees', EmployeeController::class);
    
    // Leave Type Routes
    Route::apiResource('leave-types', LeaveTypeController::class);
    
    // Leave Request Routes
    Route::apiResource('leave-requests', LeaveRequestController::class);
    Route::patch('leave-requests/{leaveRequest}/status', [LeaveRequestController::class, 'updateStatus']);
    
    // Training Program Routes
    Route::apiResource('training-programs', TrainingProgramController::class);
    
    // Training Participant Routes
    Route::apiResource('training-participants', TrainingParticipantController::class);
    Route::patch('training-participants/{trainingParticipant}/status', [TrainingParticipantController::class, 'updateStatus']);

    //Discipline Routes
    Route::prefix('hr/discipline')->group(function () {
        Route::get('/actions', [DisciplinaryActionController::class, 'index']);
        Route::get('/employees', [DisciplinaryActionController::class, 'getEmployees']);
        Route::post('/actions', [DisciplinaryActionController::class, 'store']);
    });
});