<?php

namespace App\Listeners;

use App\Events\UserConnected;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class NotifyOtherUser implements ShouldQueue
{
    use InteractsWithQueue;

    public function handle(UserConnected $event)
    {
        Log::info('UserConnected event handled:', [
            'channel' => $event->channelName,
            'other_user_id' => $event->otherUserId
        ]);
    }
}
