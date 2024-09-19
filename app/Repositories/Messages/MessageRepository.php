<?php

namespace App\Repositories\Messages;

use App\Models\Message;
use Illuminate\Support\Facades\Log;

class MessageRepository implements MessageRepositoryInterface
{
    protected $message;
    public function __construct(Message $message)
    {
        return $this->message = $message;
    }
    public function getMessagesByUser($userId, $authId)
    {
        return $this->message->where(function ($query) use ($authId, $userId) {
            $query->where('sender_id', $authId)
                ->where('receiver_id', $userId);
        })
            ->orWhere(function ($query) use ($authId, $userId) {
                $query->where('sender_id', $userId)
                    ->where('receiver_id', $authId);
            })
            ->get();
    }
    public function getMessagesByGroup($groupId)
    {
        return $this->message->where('group_id', $groupId)->get();
    }
    public function loadOlderMessages(Message $message)
    {
        if ($message->group_id) {
            return $this->message->where('created_at', '<', $message->created_at)
                ->where('group_id',  $message->group_id)
                ->latest()
                ->paginate(10);
        } else {
            return $this->message->where('created_at', '<',  $message->created_at)
                ->where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }
    }
    public function storeMessage($data)
    {
        return $this->message->create($data);
    }
    public function deleteMessage(Message $message)
    {
        $message->delete();
    }
}
