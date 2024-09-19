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
        $user = User::where('email', $email)->firstOrFail();
        $senderId = auth()->id();
        $recipientId = $user->id;
        $countFriends = count($user->friends);
        $friendRequest = $this->friendRequestRepository->findBySenderOrReceiverIds($senderId, $recipientId);
        $posts = $this->postService->getUserPosts($user->id);
        return Inertia::render('ProfilePage', [
            'profile' => $user,
            'countFriends' => $countFriends,
            'friendRequest' => $friendRequest,
            'posts' => $posts
        ]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg, png, jpg, gif|max:2048',
            'type'  => 'required|in:avatar,banner'
        ]);

        $user = auth()->user();
        $image  = $request->file('image');
        $type = $request->input('type');

        $imageName = time() .  '.'  . $image->extension();

        $imagePath  = $image->storeAs('public/' . $type . 's',  $imageName);

        $user->{$type} =  $imageName;
        $user->save();

        return response()->json(['success' => true, 'message' => ucfirst($type) . ' updated successfully!', 'image_url' => Storage::url($imagePath)]);
    }
}
