<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\FriendRequest;
use App\Models\User; // Make sure to include the User model
use App\Services\FriendRequests\FriendRequestServiceInterface;
use Inertia\Inertia;

class FriendRequestController extends Controller
{
    protected $friendRequestService;
    public function __construct(FriendRequestServiceInterface $friendRequestService)
    {
        $this->friendRequestService = $friendRequestService;
    }

    public function showFriendsPage()
    {
        $user = Auth::user();
        $friends = $user->friends;
        $friendRequests = FriendRequest::where('receiver_id', $user->id)
            ->where('status', 'pending')
            ->with('sender')
            ->get();

        return Inertia::render('FriendsPage', [
            'initialFriends' => $friends,
            'initialFriendRequests' => $friendRequests,
        ]);
    }
    public function sendRequest(Request $request)
    {
        $request->validate([
            'recipientId' => 'required|exists:users,id',
        ]);

        $recipientId = $request->input('recipientId');
        $this->friendRequestService->sendFriendRequest($recipientId);
        return back();
    }

    public function cancelRequest(Request $request)
    {
        $request->validate([
            'recipientId' => 'required|exists:users,id',
        ]);
        $recipientId = $request->input('recipientId');
        $this->friendRequestService->cancelFriendRequest($recipientId);
        return back();
    }

    public function acceptFriendRequest(Request $request)
    {
        $request->validate([
            'senderId'  =>  'required|exists:users,id',
        ]);
        $senderId = $request->input('senderId');
        $this->friendRequestService->acceptFriendRequest($senderId);

        return back();
    }

    public function declineFriendRequest(Request $request)
    {
        $request->validate([
            'senderId'  =>  'required|exists:users,id',
        ]);
        $senderId = $request->input('senderId');
        $this->friendRequestService->declineFriendRequest($senderId);

        return back();
    }

    public function removeFriend(Request $request)
    {
        $request->validate([
            'friendId' => 'required|exists:users,id',
        ]);

        $friendId = $request->input('friendId');
        $this->friendRequestService->removeFriend($friendId);
        return back();
    }
}
