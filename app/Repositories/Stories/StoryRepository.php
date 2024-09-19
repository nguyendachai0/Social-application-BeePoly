<?php

namespace App\Repositories\Stories;

use App\Models\Story;

class StoryRepository implements StoryRepositoryInterface
{
    protected $story;
    public function __construct(Story $story)
    {
        $this->story = $story;
    }
    public function getUserStories($userId)
    {
        return $this->story->where('user_id', $userId)->get();
    }
    public function createStory(array $data)
    {
        return $this->story->create($data);
    }
    public function getStoryById($id)
    {
        return $this->story->findOrFail($id);
    }
    public function updateStory($id, array $data)
    {
        $story = $this->getStoryById($id);
        $story->update($data);
        return $story;
    }
    public function deleteStory($id)
    {
        $story = $this->getStoryByid($id);
        $story->attachements()->delete();
        $story->comments()->delete();
        $story->reactions()->delete();
        $story->notifications()->delete();
        $story->delete();
    }
}
