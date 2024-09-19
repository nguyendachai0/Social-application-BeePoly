<?php

namespace App\Services\Stories;

use App\Repositories\Stories\StoryRepositoryInterface;

class StoryService implements StoryServiceInterface
{
    protected $storyRepository;
    public function __construct(StoryRepositoryInterface $storyRepository)
    {
        $this->storyRepository = $storyRepository;
    }
    public function  getUserStories($userId)
    {
        return $this->storyRepository->getUserStories($userId);
    }
    public function createStory(array $data)
    {
        $story = $this->storyRepository->createStory($data);
        if (isset($data['attachments'])) {
            foreach ($data['attachments'] as $attachment) {
                $path = $attachment->store('attachments', 'public');
                $story->attachements()->create([
                    'name' => $attachment->getClientOriginalName(),
                    'path' => $path,
                    'mime' => $attachment->getMimeType(),
                    'size' => $attachment->getSize(),
                ]);
            }
        }
        return $story;
    }
    public function getStoryById($id)
    {
        return $this->storyRepository->getStoryById($id);
    }
    public function updateStory($id, array $data)
    {
        $story = $this->storyRepository->updateStory($id, $data);
        if (isset($data['attachments'])) {
            foreach ($data['attachments'] as $attachment) {
                $path = $attachment->store('attachments', 'public');
                $story->attachments()->create([
                    'name' => $attachment->getClientOriginalName(),
                    'path' => $path,
                    'mime' => $attachment->getMimeType(),
                    'size' => $attachment->getSize(),
                ]);
            }
        }
        return $story;
    }
    public function deleteStory($id)
    {
        return $this->storyRepository->deleteStory($id);
    }
}
