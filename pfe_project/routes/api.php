<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Auth\AuthController;
use App\Http\Controllers\API\User\UserController;
use App\Http\Controllers\API\Role\RoleController;
use App\Http\Controllers\API\Employee\EmployeeController;
use App\Http\Controllers\API\Leave\LeaveTypeController;
use App\Http\Controllers\API\Leave\LeaveRequestController;
use App\Http\Controllers\API\Training\TrainingProgramController;
use App\Http\Controllers\API\Training\TrainingParticipantController;
use App\Http\Controllers\API\Discipline\DisciplinaryActionController;
use App\Http\Controllers\API\Department\DepartmentController;
use App\Http\Controllers\API\Contract\ContractController;
//use App\Http\Controllers\ZktecoController;
use App\Http\Controllers\ZktecoController as APIZk;
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

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // User Management
    Route::apiResource('users', UserController::class);
    
    // Role/Permission Management
    Route::apiResource('roles', RoleController::class);
    
    // Employee Management
    Route::apiResource('employees', EmployeeController::class);
    
    // Leave Management
    Route::apiResource('leave-types', LeaveTypeController::class);
    Route::apiResource('leave-requests', LeaveRequestController::class);
    
    // Training Management
    Route::apiResource('training-programs', TrainingProgramController::class);
    Route::apiResource('training-participants', TrainingParticipantController::class);
    
    // Discipline Management
    Route::apiResource('disciplinary-actions', DisciplinaryActionController::class);
    
    // Department Management
    Route::apiResource('departments', DepartmentController::class);
    
    // Contract Management
    Route::apiResource('contracts', ContractController::class);
});

// Authentication
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// User Management
Route::apiResource('users', UserController::class);

// Role/Permission Management
Route::apiResource('roles', RoleController::class);

Route::apiResource('departments', \App\Http\Controllers\API\Department\DepartmentController::class);

// Employee Management
Route::apiResource('employees', EmployeeController::class);
Route::get('/employees/roles', [EmployeeController::class, 'getRoles']);

// Leave Management
Route::apiResource('leave-types', LeaveTypeController::class);
Route::apiResource('leave-requests', LeaveRequestController::class);
Route::get('leave-requests/employee/{employeeId}', [LeaveRequestController::class, 'employeeLeaveRequests']);
Route::patch('leave-requests/{id}/status', [LeaveRequestController::class, 'updateStatus']);

// Training Management
Route::apiResource('training-programs', TrainingProgramController::class);
Route::prefix('training-programs/{programId}')->group(function () {
    Route::get('participants', [TrainingParticipantController::class, 'index']);
    Route::post('participants', [TrainingParticipantController::class, 'store']);
    Route::get('participants/{participantId}', [TrainingParticipantController::class, 'show']);
    Route::put('participants/{participantId}', [TrainingParticipantController::class, 'update']);
    Route::delete('participants/{participantId}', [TrainingParticipantController::class, 'destroy']);
});
Route::patch('training-participants/{id}/status', [TrainingParticipantController::class, 'updateStatus']);

// Training Participant Routes
Route::prefix('training-participants')->group(function () {
    Route::get('/', [TrainingParticipantController::class, 'index']);
    Route::get('/training/{trainingId}', [TrainingParticipantController::class, 'getByTrainingId']);
    Route::post('/assign', [TrainingParticipantController::class, 'assignEmployees']);
    Route::delete('/training/{trainingId}/employee/{employeeId}', [TrainingParticipantController::class, 'removeEmployee']);
    Route::post('/{programId}', [TrainingParticipantController::class, 'store']);
    Route::get('/{id}', [TrainingParticipantController::class, 'show']);
    Route::put('/{id}', [TrainingParticipantController::class, 'update']);
    Route::delete('/{id}', [TrainingParticipantController::class, 'destroy']);
    Route::put('/{id}/status', [TrainingParticipantController::class, 'updateStatus']);
    Route::get('/available/{programId}', [TrainingParticipantController::class, 'getAvailableEmployees']);
});

// Discipline Management
Route::get('discipline/employees', [DisciplinaryActionController::class, 'getEmployees']);
Route::apiResource('disciplinary-actions', DisciplinaryActionController::class);

// Contract Routes
Route::apiResource('contracts', ContractController::class);
Route::get('contracts/employee/{employeeId}', [ContractController::class, 'getEmployeeContracts']);
Route::post('contracts/sivp', [ContractController::class, 'storeSIVP']);
Route::post('contracts/medysis', [ContractController::class, 'storeMedysis']);


//Zkteco Routes
Route::get('GetAllAttendance', [APIZk::class, 'getAllAttendanceOfToday']);
Route::get('GetWorkHours',    [APIZk::class, 'getWorksHour']);
Route::get('AsynchroniseAttendance', [APIZk::class, 'AsynchroniseAttendance']);
