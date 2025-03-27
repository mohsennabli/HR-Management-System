<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PerformanceController extends Controller
{
    public function index()
    {
        return response()->json([
            'active_users' => $this->getActiveUsers(),
            'avg_response_time' => $this->getAvgResponseTime(),
            'user_activity' => $this->getUserActivity(),
            'api_usage' => $this->getApiUsage()
        ]);
    }

    private function getActiveUsers()
    {
        // Simulate active users (e.g., users logged in the last 15 minutes)
        return DB::table('users')
            ->where('last_login_at', '>', now()->subMinutes(15))
            ->count();
    }

    private function getAvgResponseTime()
    {
        // Simulate average response time (in milliseconds)
        return rand(50, 200); // Random value for demonstration
    }

    private function getUserActivity()
    {
        // Simulate user activity for the last 7 days
        $labels = $this->getDateRange(7);
        $data = array_map(fn () => rand(10, 100), $labels); // Random data for demonstration

        return [
            'labels' => $labels,
            'data' => $data
        ];
    }

    private function getApiUsage()
    {
        // Simulate API usage for the last 7 days
        $labels = $this->getDateRange(7);
        $data = array_map(fn () => rand(50, 500), $labels); // Random data for demonstration

        return [
            'labels' => $labels,
            'data' => $data
        ];
    }

    private function getDateRange($days)
    {
        return collect(range(0, $days))
            ->map(fn ($day) => Carbon::now()->subDays($day)->format('Y-m-d'))
            ->reverse()
            ->toArray();
    }
}