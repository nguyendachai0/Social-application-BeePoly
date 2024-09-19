<?php

namespace App\Services\Posts;

interface PostServiceInterface
{
    public function getUserPosts($userId);
    public function getPostsForUser($userId);
    public function createPost(array $data);
    public function getPostById($id);
    public function updatePost($id, array $data);
    public function deletePost($id);
}
