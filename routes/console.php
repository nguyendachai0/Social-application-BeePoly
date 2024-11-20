<?php

use Illuminate\Support\Facades\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Spatie\Health\Commands\RunHealthChecksCommand;
use App\Console\COmmands\DailyStatisticsSnapshot;


Schedule::command(RunHealthChecksCommand::class)->everySixHours();
Schedule::command(DailyStatisticsSnapshot::class)->daily();
