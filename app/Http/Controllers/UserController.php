<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\FriendRequests\FriendRequestRepositoryInterface;
use App\Services\Posts\PostServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;


class UserController extends Controller
{
    protected $friendRequestRepository;
    protected $postService;

    public function __construct(FriendRequestRepositoryInterface $friendRequestRepository, PostServiceInterface $postService)
    {
        $this->friendRequestRepository = $friendRequestRepository;
        $this->postService = $postService;
    }

    public function profile($email)
    {
        $profile = User::withCount('followers')
            ->with('fanpages')
            ->where('email', $email)
            ->firstOrFail();

        $authUserId = auth()->id();
        $profileId = $profile->id;

        $friendRequest = $this->friendRequestRepository->findBySenderOrReceiverIds($authUserId, $profileId);

        $friendStatus = 'not_friends';

        if ($friendRequest) {
            if ($friendRequest->status === 'accepted') {
                $friendStatus = 'friends';
            } elseif ($friendRequest->status === 'rejected') {
                $friendStatus = 'request_rejected';
            } elseif ($friendRequest->sender_id === $authUserId) {
                $friendStatus = 'request_sent';
            } elseif ($friendRequest->receiver_id === $authUserId) {
                $friendStatus = 'request_received';
            }
        }

        $posts = $this->postService->getUserPosts($profile->id);

        return Inertia::render('ProfilePage', [
            'profile' => $profile,
            'isOwner' => $authUserId === $profileId,
            'initialProfileFriends' =>  $profile->friends,
            'countFriends' => count($profile->friends),
            'countFollowers' => $profile->followers_count  + count($profile->friends),
            'friendRequest' => $friendRequest,
            'friendStatus' => $friendStatus,
            'posts' => $posts,
            'countPosts'  =>  count($posts),
            'initialFanpages' => $profile->fanpages
        ]);
    }

    public function uploadAvatarOrBanner(Request $request, $type)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $file = $request->file('file');

        $filename = uniqid() . '.' . $file->getClientOriginalExtension();

        $path = $file->storeAs($type . 's', $filename, 'public');

        $user = auth()->user();

        if ($user->$type && Storage::disk('public')->exists($user->$type)) {
            Storage::disk('public')->delete($user->$type);
        }

        $user->$type = $path;
        $user->save();

        return redirect()->back()->with('success', 'Uploaded ' . $type . ' successfully');
    }
}
