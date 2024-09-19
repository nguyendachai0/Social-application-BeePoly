<?php

namespace App\Services\FriendRequests;

use App\Repositories\FriendRequests\FriendRequestRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class FriendRequestService implements FriendRequestServiceInterface
{
    /**
     * Create a new class instance.
     */
    protected $friendRequestRepository;
    public function __construct(FriendRequestRepositoryInterface $friendRequestRepository)
    {
        $this->friendRequestRepository = $friendRequestRepository;
    }
    public function sendFriendRequest($recipientId)
    {
        $senderId = Auth::id();
        if ($senderId ==  (int) $recipientId) {
            return  [
                'success' => false,
                'message' => 'You cannot send a friend request to yourself.',
                'countFriends' => $this->friendRequestRepository->getFriendCount($senderId),
                'friendRequest' => $this->friendRequestRepository->getFriendRequest($senderId, $recipientId),
            ];
        }

        $existingRequest = $this->friendRequestRepository->findBySenderOrReceiverIds($senderId, $recipientId);

        if ($existingRequest) {
            if ($existingRequest->status  ===  'rejected') {
                $this->friendRequestRepository->updateStatus($existingRequest, 'accepted');
                return [
                    'success' => true,
                    'message' => 'Friend request re-accepted.',
                    'countFriend' => $this->friendRequestRepository->getFriendCount($senderId),
                    'friendRequest' => $this->friendRequestRepository->getFriendRequest($senderId, $recipientId)
                ];
            }
            return [
                'success' => false,
                'message' => 'Friend Request already exists',
                'countFriend' => $this->friendRequestRepository->getFriendCount($senderId),
                'friendRequest' => $this->friendRequestRepository->getFriendRequest($senderId, $recipientId)
            ];
        }

        $this->friendRequestRepository->createFriendRequest($senderId, $recipientId);

        return [
            'success' => true,
            'message' => 'Friend request sent successfully',
            'countFriend' => $this->friendRequestRepository->getFriendCount($senderId),
            'friendRequest' => $this->friendRequestRepository->getFriendRequest($senderId,  $recipientId)
        ];
    }
    public function cancelFriendRequest($recipientId)
    {
        $senderId = Auth::id();
        $existingRequest = $this->friendRequestRepository->findBySenderOrReceiverIds($senderId, $recipientId);
        if (!$existingRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Friend request not found.',
                'countFriends' => $this->friendRequestRepository->getFriendCount($senderId),
                'friendRequest' => $this->friendRequestRepository->getFriendRequest($senderId, $recipientId)
            ]);
        }
        $this->friendRequestRepository->deleteFriendRequest($existingRequest);
        return response()->json([
            'success' => true,
            'message' => 'Friend request cancelled successfully.',
            'countFriends' => $this->friendRequestRepository->getFriendCount($senderId),
            'friendRequest' => $this->friendRequestRepository->getFriendRequest($senderId, $recipientId)
        ]);
    }
    public function acceptFriendRequest($senderId)
    {
        $recipientId = Auth::id();
        $friendRequest = $this->friendRequestRepository->findBySenderOrReceiverIds($senderId, $recipientId);
        if (!$friendRequest) {
            return [
                'success' => false,
                'message' => 'Friend request not found.',
                'countFriends' => $this->friendRequestRepository->getFriendCount($recipientId),
                'friendRequest' => $this->friendRequestRepository->getFriendRequest($senderId, $recipientId)
            ];
        }

        if ($friendRequest->status === 'accepted') {
            return [
                'success' => false,
                'message' => 'Friend request already accepted.',
                'countFriends' => $this->friendRequestRepository->getFriendCount($recipientId),
                'friendRequest' => $this->friendRequestRepository->getFriendRequest($senderId, $recipientId)
            ];
        }
        $this->friendRequestRepository->updateStatus($friendRequest, 'accepted');

        return [
            'success' => true,
            'message' => 'Friend request accepted successfully.',
            'countFriends' => $this->friendRequestRepository->getFriendCount($recipientId),
            'friendRequest' => $this->friendRequestRepository->getFriendRequest($senderId, $recipientId)
        ];
    }

    public function  declineFriendRequest($senderId)
    {
        $recipientId = Auth::id();
        $friendRequest = $this->friendRequestRepository->findBySenderReceiverAndStatus($senderId, $recipientId, 'pending');
        if (!$friendRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Friend request not found.',
                'countFriends' => $this->friendRequestRepository->getFriendCount($recipientId),
                'friendRequest' => $this->friendRequestRepository->getFriendRequest($recipientId, $senderId)
            ], 404);
        }
        $friendRequest->update(['status' => 'rejected']);

        return response()->json([
            'success' => true,
            'message' => 'Friend request declined.',
            'countFriends' => $this->friendRequestRepository->getFriendCount($recipientId),
            'friendRequest' => $this->friendRequestRepository->getFriendRequest($recipientId, $senderId)
        ]);
    }
    public function removeFriend($friendId)
    {
        $userId = Auth::id();
        $friendship = $this->friendRequestRepository->findBySenderOrReceiverAndStatus($userId, $friendId, 'accepted');
        if (!$friendship) {
            return response()->json([
                'success' => false,
                'message' => 'Friendship not found.',
                'countFriends' => $this->friendRequestRepository->getFriendCount($userId),
                'friendRequest' => null // No friend request details
            ], 404);
        }
        $this->friendRequestRepository->deleteFriendRequest($friendship);
        return response()->json([
            'success' => true,
            'message' => 'Friend removed successfully.',
            'countFriends' => $this->friendRequestRepository->getFriendCount($userId),
            'friendRequest' => null // No friend request details
        ]);
    }
}
