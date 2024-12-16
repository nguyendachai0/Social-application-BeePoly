<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use App\Models\Reaction;
use App\Models\Statistic;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function getDashboardData()
    {
        $allUsers = User::count();
        $newSignups = User::where('created_at', '>=', now()->subDays(30))->count();
        $contentActivity = Post::count() + Comment::count();


        $userGrowthData = $this->getUserGrowthData();
        $demographics = $this->getDemographics();
        $contentStats = $this->getContentStats();


        $stats = [
            [
                'title' => 'All Users',
                'value' => $allUsers,
                'change' => $this->getChangePercentage('all_users'),
                'icon' => 'FiUsers',
            ],
            [
                'title' => 'New Sign-ups',
                'value' => $newSignups,
                'change' => $this->getChangePercentage('new_signups'),
                'icon' => 'FiUserPlus',
            ],
            [
                'title' => 'Content Activity',
                'value' => $contentActivity,
                'change' => $this->getChangePercentage('content_activity'),
                'icon' => 'FiActivity',
            ]
        ];

        // Pass data to Inertia page
        return Inertia::render('Admin/Admin', [
            'stats' => $stats,
            'userGrowthData' => $userGrowthData,
            'demographicsData' => $demographics,
            'contentStats' => $contentStats,
        ]);
    }

    private function getChangePercentage($type)
    {
        $previousStat = Statistic::where('type', $type)
            ->whereDate('date', Carbon::today()->subDay())
            ->first();

        $currentStat = Statistic::where('type', $type)
            ->whereDate('date', Carbon::today())
            ->first();

        if (!$previousStat || !$currentStat) {
            return '0%';
        }

        $change = $currentStat->value - $previousStat->value;
        $percentageChange = ($change / $previousStat->value) * 100;

        return ($percentageChange > 0 ? '+' : '') . round($percentageChange, 2) . '%';
    }

    private function getDemographics()
    {
        $ageGroups = User::selectRaw('
            CASE
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) < 18 THEN "Under 18"
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 18 AND 24 THEN "18-24"
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 25 AND 34 THEN "25-34"
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 35 AND 44 THEN "35-44"
                WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 45 AND 54 THEN "45-54"
                ELSE "55+"
            END AS age_group, COUNT(*) AS count')
            ->groupBy('age_group')
            ->get();

        $ageGroupLabels = $ageGroups->pluck('age_group')->toArray();

        $ageGroupCounts = $ageGroups->pluck('count')->toArray();

        $ageGroupColors = [
            'Under 18' => '#FF6384',
            '18-24' => '#36A2EB',
            '25-34' => '#FFCE56',
            '35-44' => '#4BC0C0',
            '45-54' => '#9966FF',
            '55+' => '#FF9F40',
        ];

        $backgroundColors = array_map(function ($ageGroup) use ($ageGroupColors) {
            return $ageGroupColors[$ageGroup] ?? '#000000';
        }, $ageGroupLabels);

        return [
            'labels' => $ageGroupLabels,
            'datasets' => [
                [
                    'data' => $ageGroupCounts,
                    'backgroundColor' => $backgroundColors,
                ]
            ]
        ];
    }

    private function getContentStats()
    {
        $postCount = Post::count();
        $commentCount = Comment::count();
        $reactionCount = Reaction::count();

        return [
            'labels' => ['Posts', 'Comments', 'Reactions'],
            'datasets' => [
                [
                    'label' => 'Content Stats',
                    'data' => [$postCount, $commentCount, $reactionCount],
                    'backgroundColor' => ['#FF6384', '#36A2EB', '#FFCE56'],
                ]
            ]
        ];
    }

    private function getUserGrowthData()
    {
        $userGrowth = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $months = $userGrowth->pluck('month')->map(function ($month) {
            return Carbon::createFromFormat('Y-m', $month)->format('M');
        })->toArray();
        $growthCounts = $userGrowth->pluck('count')->toArray();

        return [
            'labels' => $months,
            'datasets' => [
                [
                    'label' => 'User Growth',
                    'data' => $growthCounts,
                    'fill' => false,
                    'borderColor' => 'rgb(54, 162, 235)',
                    'backgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'tension' => 0.1,
                ]
            ]
        ];
    }
}
