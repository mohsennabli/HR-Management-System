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
use App\Http\Controllers\API\StatisticsController;
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
    
    // Statistics Routes
    Route::prefix('statistics')->group(function () {
        Route::get('/employees', [StatisticsController::class, 'getEmployeeStatistics']);
        Route::get('/leaves', [StatisticsController::class, 'getLeaveStatistics']);
        Route::get('/departments', [StatisticsController::class, 'getDepartmentStatistics']);
        Route::get('/disciplinary', [StatisticsController::class, 'getDisciplinaryStatistics']);
        Route::get('/attendance', [StatisticsController::class, 'getAttendanceStatistics']);
        Route::get('/training', [StatisticsController::class, 'getTrainingStatistics']);
    });
    
    // User Management
    Route::apiResource('users', UserController::class);
    Route::get('/users/by-role/{roleId}', [UserController::class, 'getUsersByRole']);
    
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

// Remove duplicate routes outside the middleware group
// ... rest of existing code ...

//Zkteco Routes
Route::get('GetAllAttendance', [APIZk::class, 'getAllAttendanceOfToday']);
Route::get('GetWorkHours',    [APIZk::class, 'getWorksHour']);
Route::get('AsynchroniseAttendance', [APIZk::class, 'AsynchroniseAttendance']);
