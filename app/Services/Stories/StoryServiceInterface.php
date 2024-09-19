<?php

namespace App\Services\Stories;

interface StoryServiceInterface
{
    public function getUserStories($userId);
    public function createStory(array $data);
    public function getStoryById($id);
    public function updateStory($id, array $data);
    public function deleteStory($id);
}
