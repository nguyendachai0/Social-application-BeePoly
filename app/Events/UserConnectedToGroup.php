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
use App\Models\User;
use Illuminate\Support\Facades\Log;

class UserConnectedToGroup implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $user;
    public $groupId;
    /**
     * Create a new event instance.
     */
    public function __construct(User $user, int $groupId)
    {
        $this->user = $user;
        $this->groupId = $groupId;
        Log::info('User and groupId in constructor', [
            'user' => $user->toArray(), // Convert the User object to an array for logging
            'groupId' => $groupId,
        ]);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return  new PrivateChannel('message.group.' . $this->groupId);
    }

    public function broadcastWith()
    {
        return [
            'user' => $this->user->only(['id', 'first_name', 'last_name']),
            'groupId' => $this->groupId,
        ];
    }
}
