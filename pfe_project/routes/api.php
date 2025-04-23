<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Admin\UserController;
use App\Http\Controllers\API\Admin\RoleController;
use App\Http\Controllers\API\Admin\PermissionController;
use App\Http\Controllers\API\Admin\EmployeeController as AdminEmployeeController;
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
    // User Management
    Route::apiResource('users', UserController::class);
    
    // Role/Permission Management
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);
    
    // Employee Management (Admin Perspective)
    Route::apiResource('employees', AdminEmployeeController::class);
    
   
});

// Authentication
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// HR Management Routes
Route::prefix('hr')->group(function () {
    // Employee Management (HR Perspective)
    Route::apiResource('employees', EmployeeController::class);

    // Leave Management
    Route::apiResource('leave-types', LeaveTypeController::class);
    Route::apiResource('leave-requests', LeaveRequestController::class);
    Route::patch('leave-requests/{leaveRequest}/status', [LeaveRequestController::class, 'updateStatus']);

    // Training Management
    Route::apiResource('training-programs', TrainingProgramController::class);
    Route::apiResource('training-participants', TrainingParticipantController::class);
    Route::patch('training-participants/{trainingParticipant}/status', [TrainingParticipantController::class, 'updateStatus']);

    // Disciplinary Actions
    Route::prefix('discipline')->group(function () {
        Route::get('/actions', [DisciplinaryActionController::class, 'index']);
        Route::get('/employees', [DisciplinaryActionController::class, 'getEmployees']);
        Route::post('/actions', [DisciplinaryActionController::class, 'store']);
        Route::delete('/actions/{id}', [DisciplinaryActionController::class, 'destroy']);
    });
});