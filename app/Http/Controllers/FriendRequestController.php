<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\FriendRequest;
use App\Models\User; // Make sure to include the User model
use App\Services\FriendRequests\FriendRequestServiceInterface;

class FriendRequestController extends Controller
{
    protected $friendRequestService;
    public function __construct(FriendRequestServiceInterface $friendRequestService)
    {
        $this->friendRequestService = $friendRequestService;
    }
    public function sendRequest(Request $request)
    {
        $request->validate([
            'recipientId' => 'required|exists:users,id',
        ]);

        $recipientId = $request->input('recipientId');
        return $this->friendRequestService->sendFriendRequest($recipientId);
    }

    public function cancelRequest(Request $request)
    {
        $request->validate([
            'recipientId' => 'required|exists:users,id',
        ]);
        $recipientId = $request->input('recipientId');
        return $this->friendRequestService->cancelFriendRequest($recipientId);
    }

    public function acceptFriendRequest(Request $request)
    {
        $request->validate([
            'senderId'  =>  'required|exists:users,id',
        ]);
        $senderId = $request->input('senderId');
        return $this->friendRequestService->acceptFriendRequest($senderId);
    }

    public function declineFriendRequest(Request $request)
    {
        $request->validate([
            'senderId'  =>  'required|exists:users,id',
        ]);
        $senderId = $request->input('senderId');
        return $this->friendRequestService->declineFriendRequest($senderId);
    }

    public function removeFriend(Request $request)
    {
        $request->validate([
            'friendId' => 'required|exists:users,id',
        ]);

        $friendId = $request->input('friendId');
        return $this->friendRequestService->removeFriend($friendId);
    }
}
