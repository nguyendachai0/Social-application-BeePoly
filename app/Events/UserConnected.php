<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UserConnected implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $channelName;
    public $userId;

    public function __construct($channelName, $userId)
    {
        $this->channelName = $channelName;
        $this->userId = $userId;
        Log::info('User connected to channel:', [
            'user_id' => $userId,
            'channel' => $channelName
        ]);
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user-connected.' . $this->userId);
    }
}
