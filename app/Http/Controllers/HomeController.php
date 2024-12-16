<?php

namespace App\Http\Controllers;

use App\Services\Posts\PostServiceInterface;
use Inertia\Inertia;

class HomeController extends Controller
{
    protected $postService;

    public function __construct(PostServiceInterface $postService)
    {
        $this->postService = $postService;
    }

    public function home()
    {
        $user = auth()->user();
        $posts = $this->postService->getPostsForUser($user->id);

        return Inertia::render('Client/Home', [
            'initialPosts' => $posts,
        ]);
    }
}
