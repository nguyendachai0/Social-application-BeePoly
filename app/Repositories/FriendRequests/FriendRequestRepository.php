<?php

namespace App\Repositories\FriendRequests;

use App\Models\FriendRequest;

class FriendRequestRepository implements FriendRequestRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    protected $friendRequest;
    public function __construct(FriendRequest  $friendRequest)
    {
        $this->friendRequest = $friendRequest;
    }
    public function findBySenderOrReceiverIds($senderId, $receiverId)
    {
        return $this->friendRequest->where(function ($query)  use ($senderId, $receiverId) {
            $query->where('sender_id', $senderId)
                ->where('receiver_id', $receiverId);
        })->orWhere(function ($query) use ($senderId, $receiverId) {
            $query->where('sender_id', $receiverId)
                ->where('receiver_id', $senderId);
        })->first();
    }
    public function findBySenderOrReceiverAndStatus($senderId, $receiverId, $status)
    {
        return $this->friendRequest->where(function ($query) use ($senderId, $receiverId, $status) {
            $query->where('sender_id', $senderId)
                ->where('receiver_id', $receiverId)
                ->where('status', $status);
        })->orWhere(function ($query) use ($senderId, $receiverId, $status) {
            $query->where('sender_id', $receiverId)
                ->where('receiver_id', $senderId)
                ->where('status', $status);
        })->first();
    }
    public function findBySenderReceiverAndStatus($senderId, $receiverId, $status)
    {
        return $this->friendRequest->where('sender_id', $senderId)
            ->where('receiver_id', $receiverId)
            ->where('status',  $status)
            ->first();
    }
    public function createFriendRequest($senderId, $receiverId)
    {
        return $this->friendRequest->create([
            'sender_id' =>  $senderId,
            'receiver_id'  => $receiverId,
            'status' => 'pending'
        ]);
    }
    public function updateStatus(FriendRequest $friendRequest, $status)
    {
        $friendRequest->update([
            'status' =>  $status
        ]);
    }
    public function deleteFriendRequest(FriendRequest $friendRequest)
    {
        $friendRequest->delete();
    }
    public function getFriendCount($userId)
    {
        return $this->friendRequest->where(function ($query) use ($userId) {
            $query->where('sender_id', $userId)
                ->where('status', 'accepted');
        })->orWhere(function ($query) use ($userId) {
            $query->where('receiver_id',  $userId)
                ->where('status', 'accepted');
        })->count();
    }
    public function getFriendRequest($userId, $otherId)
    {
        return $this->friendRequest->where(function ($query) use ($userId, $otherId) {
            $query->where('sender_id', $userId)
                ->where('receiver_id',  $otherId);
        })->orWhere(function ($query) use ($userId, $otherId) {
            $query->where('sender_id', $otherId)
                ->where('receiver_id', $userId);
        })->first();
    }
}
