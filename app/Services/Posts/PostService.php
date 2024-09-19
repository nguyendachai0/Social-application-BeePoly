<?php

namespace App\Services\Posts;

use App\Repositories\Posts\PostRepositoryInterface;
use Illuminate\Support\Facades\Log;

class PostService implements PostServiceInterface
{
    protected $postRepository;
    public function __construct(PostRepositoryInterface $postRepository)
    {
        $this->postRepository = $postRepository;
    }
    public function getUserPosts($userId)
    {
        return $this->postRepository->getUserPosts($userId);
    }
    public function getPostsForUser($userId)
    {
        return $this->postRepository->getPostsForUser($userId);
    }
    public function createPost(array $data)
    {
        $post = $this->postRepository->createPost($data);
        if (isset($data['attachments'])) {
            foreach ($data['attachments'] as $attachment) {
                $path = $attachment->store('attachments', 'public');
                $post->attachments()->create([
                    'name' => $attachment->getClientOriginalName(),
                    'path' => $path,
                    'mime' => $attachment->getMimeType(),
                    'size' => $attachment->getSize(),
                ]);
            }
        }
        Log::info('posts', [$post]);
        return  $post;
    }
    public function getPostById($id)
    {
        return $this->postRepository->getPostById($id);
    }
    public function updatePost($id, array $data)
    {
        $post = $this->postRepository->updatePost($id, $data);
        if (isset($data['attachments'])) {
            foreach ($data['attachments'] as $attachment) {
                $path = $attachment->store('attachments', 'public');
                $post->attachments()->create([
                    'name' => $attachment->getClientOriginalName(),
                    'path' => $path,
                    'mime' => $attachment->getMimeType(),
                    'size' => $attachment->getSize(),
                ]);
            }
        }
        return $post;
    }
    public function deletePost($id)
    {
        $this->postRepository->deletepost($id);
    }
}
