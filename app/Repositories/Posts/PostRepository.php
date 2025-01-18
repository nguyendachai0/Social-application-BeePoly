<?php

namespace App\Repositories\Posts;

use App\Models\Post;
use App\Models\User;
use App\Models\Fanpage;

class PostRepository implements PostRepositoryInterface
{
    protected $post;
    public function __construct(Post $post)
    {
        $this->post = $post;
    }
    public function getUserPosts($userId)
    {
        $authUserId = auth()->id();

        return $this->post->where('user_id', $userId)
        ->where(function ($query) use ($authUserId, $userId) {
            if ($authUserId !== $userId) {
                // Viewing someone else's profile
                $query->where('visibility', 'public')
                      ->orWhere(function ($subQuery) use ($authUserId) {
                          // Include posts visible to friends
                          $subQuery->where('visibility', 'friends');
                          
                        });
                    }
                      })
        ->with('user')
        ->with('attachments')
        ->with('reactions')
        ->with('comments')
        ->with('taggedUsers')
        ->latest()
        ->get();
    }

    public function getPostsForUser($userId)
    {
        $user = User::findOrFail($userId);
        $friends = $user->friends;
        $friendIds = $friends->pluck('id');

        return $this->post->where(function ($query) use ($userId, $friendIds) {
            $query->whereIn('user_id', $friendIds->merge([$userId]))
            ->where('visibility', '!=', 'private');
        })
            ->orWhere('visibility', 'public')
            ->with('user')
            ->with('attachments')
            ->with('reactions')
            ->with('comments')
            ->with('taggedUsers')
            ->latest()
            ->get();
    }
    
    public function getPostsForFanpage($fanpageId)
    {
        $fanpage = Fanpage::findOrFail($fanpageId);
        return $fanpage->posts()
            ->with('user')
            ->with('attachments')
            ->with('reactions')
            ->with('comments')
            ->with('taggedUsers')
            ->latest()
            ->get();
    }

    public function createPost(array $data)
    {
        return $this->post->create($data);
    }
    public function getPostById($id)
    {
        return $this->post->with(['user', 'attachments', 'reactions', 'comments'])->findOrFail($id);
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
