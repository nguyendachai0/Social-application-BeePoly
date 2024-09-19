<?php

namespace App\Providers;

use App\Models\FriendRequest;
use App\Repositories\FriendRequests\FriendRequestRepository;
use App\Repositories\FriendRequests\FriendRequestRepositoryInterface;
use App\Repositories\Messages\MessageRepository;
use App\Repositories\Messages\MessageRepositoryInterface;
use App\Repositories\Posts\PostRepository;
use App\Repositories\Posts\PostRepositoryInterface;
use App\Repositories\Stories\StoryRepository;
use App\Repositories\Stories\StoryRepositoryInterface;
use App\Services\FriendRequests\FriendRequestServiceInterface;
use App\Services\FriendRequests\FriendRequestService;
use App\Services\Messages\MessageService;
use App\Services\Messages\MessageServiceInterface;
use App\Services\Posts\PostService;
use App\Services\Posts\PostServiceInterface;
use App\Services\Stories\StoryService;
use App\Services\Stories\StoryServiceInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(MessageRepositoryInterface::class, MessageRepository::class);
        $this->app->bind(MessageServiceInterface::class, MessageService::class);
        $this->app->bind(FriendRequestRepositoryInterface::class, FriendRequestRepository::class);
        $this->app->bind(FriendRequestServiceInterface::class, FriendRequestService::class);
        $this->app->bind(PostRepositoryInterface::class, PostRepository::class);
        $this->app->bind(PostServiceInterface::class, PostService::class);
        $this->app->bind(StoryRepositoryInterface::class, StoryRepository::class);
        $this->app->bind(StoryServiceInterface::class, StoryService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
