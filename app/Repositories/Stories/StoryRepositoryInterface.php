<?php

namespace App\Repositories\Stories;

interface StoryRepositoryInterface
{
    public function getUserStories($userId);
    public function createStory(array $data);
    public function getStoryById($id);
    public function updateStory($id, array $data);
    public function deleteStory($id);
}
