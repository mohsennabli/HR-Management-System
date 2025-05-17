<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\User\UserController;
use App\Http\Controllers\API\Role\RoleController;
use App\Http\Controllers\API\Permission\PermissionController;
use App\Http\Controllers\API\Employee\EmployeeController;
use App\Http\Controllers\API\Leave\LeaveTypeController;
use App\Http\Controllers\API\Leave\LeaveRequestController;
use App\Http\Controllers\API\Training\TrainingProgramController;
use App\Http\Controllers\API\Training\TrainingParticipantController;
use App\Http\Controllers\API\Discipline\DisciplinaryActionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\Department\DepartmentController;
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

// Protected routes
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Add your other protected routes here
});

// Authentication
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// User Management
Route::apiResource('users', UserController::class);

// Role/Permission Management
Route::apiResource('roles', RoleController::class);
Route::apiResource('permissions', PermissionController::class);

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

// Discipline Management
Route::get('discipline/employees', [DisciplinaryActionController::class, 'getEmployees']);
Route::apiResource('disciplinary-actions', DisciplinaryActionController::class);