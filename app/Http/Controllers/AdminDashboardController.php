<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use App\Models\Comment;

use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function getDashboardData()
    {
        $activeUsers = User::where('status', 'active')->count();

        $newSignups = User::where('created_at', '>=', now()->subDays(30))->count();

        $contentActivity = Post::count() + Comment::count();

        $userEngagement = $this->getUserEngagementTrends();

        $demographics = $this->getDemographics();

        $locationStats = $this->getUserLocations();

        return response()->json([
            'stats' => [
                [
                    'title' => 'Active Users',
                    'value' => $activeUsers,
                    'change' => '+12%',
                    'icon' => 'FiUsers',
                ],
                [
                    'title' => 'New Sign-ups',
                    'value' => $newSignups,
                    'change' => '+8%',
                    'icon' => 'FiUserPlus',
                ],
                [
                    'title' => 'Content Activity',
                    'value' => $contentActivity,
                    'change' => '+15%',
                    'icon' => 'FiActivity',
                ]
            ],
            'userTrendsData' => $userEngagement,
            'demographicsData' => $demographics,
            'locationData' => $locationStats,
        ]);
    }

    private function getDemographics()
    {
        // Placeholder: You can use data from your users' profiles or other models
        return [
            'labels' => ['18-24', '25-34', '35-44', '45-54', '55+'],
            'datasets' => [
                [
                    'data' => [30, 25, 20, 15, 10], // Example percentage distribution
                    'backgroundColor' => ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                ]
            ]
        ];
    }

    private function getUserLocations()
    {
        // Example data - you can fetch real data based on the user's location
        return [
            'labels' => ['NA', 'EU', 'ASIA', 'SA', 'AF', 'OC'],
            'datasets' => [
                [
                    'label' => 'Users by Region',
                    'data' => [4500, 3800, 3200, 2100, 1800, 1200],
                    'backgroundColor' => 'rgba(54, 162, 235, 0.5)',
                ]
            ]
        ];
    }

    private function getUserEngagementTrends()
    {
        // For simplicity, let's assume we're fetching the number of active users per month
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        $engagementData = [65, 59, 80, 81, 56, 55]; // Placeholder for actual data
        return [
            'labels' => $months,
            'datasets' => [
                [
                    'label' => 'User Engagement',
                    'data' => $engagementData,
                    'fill' => false,
                    'borderColor' => 'rgb(75, 192, 192)',
                    'tension' => 0.1,
                ]
            ]
        ];
    }
}
