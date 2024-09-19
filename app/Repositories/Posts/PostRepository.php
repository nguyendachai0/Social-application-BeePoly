<?php

namespace App\Repositories\Posts;

use App\Models\Post;
use App\Models\User;

class PostRepository implements PostRepositoryInterface
{
    protected $post;
    public function __construct(Post $post)
    {
        $this->post = $post;
    }
    public function getUserPosts($userId)
    {
        return $this->post->where('user_id', $userId)
            ->with('user')
            ->with('attachments')
            ->with('reactions')
            ->with('comments')
            ->latest()
            ->get();
    }
    public function getPostsForUser($userId)
    {
        $user = User::findOrFail($userId);
        $friends = $user->friends;
        $friendIds = $friends->pluck('id');
        return $this->post->whereIn('user_id', $friendIds->merge([$userId]))
            ->with('user')
            ->with('attachments')
            ->with('reactions')
            ->with('comments')
            ->latest()
            ->get();
    }
    public function createPost(array $data)
    {
        return $this->post->create($data);
    }
    public function getPostById($id)
    {
        return $this->post->findOrFail($id);
    }
    public function updatePost($id, array $data)
    {
        $post = $this->getPostById($id);
        $post->update($data);
        return $post;
    }
    public function deletePost($id)
    {
        $post =  $this->getPostById($id);
        $post->attachments()->delete();
        $post->comments()->delete();
        $post->reactions()->delete();
        $post->notifications()->delete();
        $post->delete();
    }
}
