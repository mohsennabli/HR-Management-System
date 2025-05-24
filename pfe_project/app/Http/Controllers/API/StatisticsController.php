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
} 