<?php

namespace App\Console\Commands;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Statistic;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DailyStatisticsSnapshot extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'snapshot:statistics';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Store daily snapshot of dashboard statistics';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $data = [
            'all_users' => User::count(),
            'new_signups' => User::where('created_at', '>=', now()->subDays(30))->count(),
            'content_activity' => Post::count() + Comment::count(),
        ];

        foreach ($data as $type => $value) {
            Statistic::updateOrCreate(
                [
                    'type' => $type,
                    'date' => Carbon::today(),
                ],
                ['value' => $value]
            );
        }

        $this->info('Daily statistics snapshot saved.');
    }
}
