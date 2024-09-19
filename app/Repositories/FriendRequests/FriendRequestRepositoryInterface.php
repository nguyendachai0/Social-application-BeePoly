<?php

namespace App\Repositories\FriendRequests;

use App\Models\FriendRequest;

interface FriendRequestRepositoryInterface
{
    public function findBySenderOrReceiverIds($senderId, $receiverId);
    public function findBySenderOrReceiverAndStatus($senderId, $receiverId, $status);
    public function findBySenderReceiverAndStatus($senderId, $receiverId, $status);
    public function createFriendRequest($senderId,  $receiverId);
    public function updateStatus(FriendRequest $friendRequest,  $status);
    public function deleteFriendRequest(FriendRequest $friendRequest);
    public function getFriendCount($userId);
    public function getFriendRequest($userId, $otherId);
}
