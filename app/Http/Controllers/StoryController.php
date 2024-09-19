<?php

namespace App\Http\Controllers;

use App\Services\Stories\StoryServiceInterface;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    protected $storyService;
    public function __construct(StoryServiceInterface $storyService)
    {
        $this->storyService = $storyService;
    }
    public function index()
    {
        $user = auth()->user();
        $posts = $this->storyService->getUserStories($user->id);
        return response()->json($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' =>  'required|exists:users,id',
            'caption' =>  'string',
            'attachments.*' => 'file|mimes:jpg,png,pdf,docx|max:2048'
        ]);
        $data = $request->all();
        $post = $this->storyService->createStory($data);
        return response()->json($post, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = $this->storyService->getStoryById($id);
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
        $post = $this->storyService->updateStory($id, $data);
        return response()->json($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->storyService->deleteStory($id);
        return response()->json(['message' => 'Story deleted successfully']);
    }
}
