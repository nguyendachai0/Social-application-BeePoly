<?php

namespace App\Http\Controllers;

use App\Events\PostCreated;
use Illuminate\Http\Request;
use App\Services\Posts\PostServiceInterface;
use App\Http\Requests\StorePostRequest;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    protected $postService;
    public function __construct(PostServiceInterface $postService)
    {
        $this->postService = $postService;
    }
    public function index()
    {
        $user = auth()->user();
        $posts = $this->postService->getPostsForUser($user->id);
        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(StorePostRequest $request)
    public function store(StorePostRequest $request)
    {
        $data = [
            'user_id' => auth()->id(),
            'caption' => $request->input('caption'),
            'attachments' => $request->file('attachments'),
            'fanpage_id' => $request->input('fanpage_id'),
            'taggedFriends' => $request->input('taggedFriends'),
            'visibility' => $request->input('visibility')
        ];

        $post = $this->postService->createPost($data);

        $post = $this->postService->getPostById($post['id']);

        $user = auth()->user();
        $friends = $user->friends->pluck('id');
        $recipientIds = $friends->merge([$user->id]);

        foreach ($recipientIds as $id) {
            event(new PostCreated("user-feed.{$id}", $post));
        }

        if (isset($data['taggedFriends']) && is_array($data['taggedFriends'])) {
            $post->taggedUsers()->sync($data['taggedFriends']);
        }


        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = $this->postService->getPostById($id);
        return response()->json($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePostRequest $request, string $id)
    {
        $data = [
            'user_id' => auth()->id(),
            'caption' => $request->input('caption'),
            'attachments' => $request->file('attachments'),
            'fanpage_id' => $request->input('fanpage_id'),
            'taggedFriends' => $request->input('taggedFriends'),
            'visibility' => $request->input('visibility')
        ];

        $this->postService->updatePost($id, $data);

        $post = $this->postService->getPostById($id);

        if (isset($data['taggedFriends']) && is_array($data['taggedFriends'])) {
            $post->taggedUsers()->sync($data['taggedFriends']);
        }

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->postService->deletePost($id);
        return back();
    }
}
