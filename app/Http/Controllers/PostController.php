<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Posts\PostServiceInterface;
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
    public function store(Request $request)
    {
        $request->validate([
            'caption' =>  'string',
            'attachments.*' => 'file|mimes:jpg,png,pdf,docx|max:2048'
        ]);
        $data = [
            'user_id' => auth()->id(),
            'caption' => $request->input('caption'),
            'attachments' => $request->file('attachments'), // Multiple files
        ];

        $post = $this->postService->createPost($data);
        return response()->json($post, 201);
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
    public function update(Request $request, string $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'caption' => 'string',
            'attachements.*' => 'file|mimes:jpg,png,pdf,docx|max:2048'
        ]);
        $data = $request->all();
        $post = $this->postService->updatePost($id, $data);
        return response()->json($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->postService->deletePost($id);
        return response()->json(['message' => 'Post deleted successfully']);
    }
}
