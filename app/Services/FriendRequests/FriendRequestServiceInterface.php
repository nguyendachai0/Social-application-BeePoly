<?php

namespace App\Services\FriendRequests;

interface FriendRequestServiceInterface
{
    public function sendFriendRequest($recipientId);
    public function cancelFriendRequest($recipientId);
    public function acceptFriendRequest($senderId);
    public function declineFriendRequest($senderId);
    public function removeFriend($friendId);
}
