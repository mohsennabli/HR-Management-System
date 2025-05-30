<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Department;
use App\Models\LeaveRequest;
use App\Models\DisciplinaryAction;
use App\Models\TrainingProgram;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function getEmployeeStatistics()
    {
        $fullTime = Employee::where('employment_type', 'full-time')->count();
        $partTime = Employee::where('employment_type', 'part-time')->count();
        $contract = Employee::where('employment_type', 'contract')->count();

        return response()->json([
            'fullTime' => $fullTime,
            'partTime' => $partTime,
            'contract' => $contract
        ]);
    }

    public function getLeaveStatistics()
    {
        $approved = LeaveRequest::where('status', 'approved')->count();
        $pending = LeaveRequest::where('status', 'pending')->count();
        $rejected = LeaveRequest::where('status', 'rejected')->count();

        return response()->json([
            'approved' => $approved,
            'pending' => $pending,
            'rejected' => $rejected
        ]);
    }

    public function getDepartmentStatistics()
    {
        $departments = Department::withCount('employees')->get();
        
        return response()->json([
            'names' => $departments->pluck('name'),
            'employeeCounts' => $departments->pluck('employees_count')
        ]);
    }

    public function getDisciplinaryStatistics()
    {
        $months = collect(range(0, 5))->map(function ($i) {
            return Carbon::now()->subMonths($i)->format('M');
        })->reverse();

        $cases = collect(range(0, 5))->map(function ($i) {
            return DisciplinaryAction::whereMonth('created_at', Carbon::now()->subMonths($i)->month)
                ->whereYear('created_at', Carbon::now()->subMonths($i)->year)
                ->count();
        })->reverse();

        return response()->json([
            'months' => $months,
            'cases' => $cases
        ]);
    }

    public function getAttendanceStatistics()
    {
        $months = collect(range(0, 11))->map(function ($i) {
            return Carbon::now()->subMonths($i)->format('M');
        })->reverse();

        $rates = collect(range(0, 11))->map(function ($i) {
            $month = Carbon::now()->subMonths($i);
            $totalDays = $month->daysInMonth;
            $totalPresent = Attendance::whereMonth('date', $month->month)
                ->whereYear('date', $month->year)
                ->where('status', 'present')
                ->count();
            
            return $totalDays > 0 ? round(($totalPresent / $totalDays) * 100, 1) : 0;
        })->reverse();

        return response()->json([
            'months' => $months,
            'rates' => $rates
        ]);
    }

    public function getTrainingStatistics()
    {
        $months = collect(range(0, 2))->map(function ($i) {
            return Carbon::now()->subMonths($i)->format('M');
        })->reverse();

        $programs = collect(range(0, 2))->map(function ($i) {
            return TrainingProgram::whereMonth('start_date', Carbon::now()->subMonths($i)->month)
                ->whereYear('start_date', Carbon::now()->subMonths($i)->year)
                ->count();
        })->reverse();

        return response()->json([
            'months' => $months,
            'programs' => $programs
        ]);
    }

    public function getAllStatistics()
    {
        // Get current month and year
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Get employee counts by type from contracts table
        $employeeStats = [
            'total' => Employee::count(),
            'byType' => [
                'fullTime' => DB::table('contracts')
                    ->where('pattern', 'full-time')
                    ->where('end_date', '>=', now())
                    ->distinct('employee_id')
                    ->count('employee_id'),
                'partTime' => DB::table('contracts')
                    ->where('pattern', 'part-time')
                    ->where('end_date', '>=', now())
                    ->distinct('employee_id')
                    ->count('employee_id'),
                'contract' => DB::table('contracts')
                    ->where('contract_type', 'sivp')
                    ->where('end_date', '>=', now())
                    ->distinct('employee_id')
                    ->count('employee_id')
            ]
        ];

        // Get attendance stats for current month
        $attendanceStats = [
            'today' => Attendance::whereDate('timestamp', Carbon::today())->count(),
            'thisMonth' => Attendance::whereMonth('timestamp', $currentMonth)
                ->whereYear('timestamp', $currentYear)
                ->count()
        ];

        // Get training program stats
        $trainingStats = [
            'total' => TrainingProgram::count(),
            'active' => TrainingProgram::where('status', 'ongoing')->count(),
            'thisMonth' => TrainingProgram::whereMonth('start_date', $currentMonth)
                ->whereYear('start_date', $currentYear)
                ->count()
        ];

        // Get disciplinary action stats
        $disciplinaryStats = [
            'total' => DisciplinaryAction::count(),
            'thisMonth' => DisciplinaryAction::whereMonth('created_at', $currentMonth)
                ->whereYear('created_at', $currentYear)
                ->count()
        ];

        // Get department stats
        $departmentStats = Department::withCount('employees')->get()
            ->map(function ($department) {
                return [
                    'name' => $department->name,
                    'count' => $department->employees_count
                ];
            });

        // Get attendance trend (last 6 months)
        $attendanceTrend = collect(range(0, 5))->map(function ($i) {
            $month = Carbon::now()->subMonths($i);
            return [
                'month' => $month->format('M'),
                'count' => Attendance::whereMonth('timestamp', $month->month)
                    ->whereYear('timestamp', $month->year)
                    ->count()
            ];
        })->reverse();

        return response()->json([
            'employeeStats' => $employeeStats,
            'attendanceStats' => $attendanceStats,
            'trainingStats' => $trainingStats,
            'disciplinaryStats' => $disciplinaryStats,
            'departmentStats' => $departmentStats,
            'attendanceTrend' => $attendanceTrend
        ]);
    }
} 