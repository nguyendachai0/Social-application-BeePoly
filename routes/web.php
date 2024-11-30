<?php

use App\Http\Controllers\AdminContentManagementController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminUserManagementController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FanpageController;
use App\Http\Controllers\FanpageFollowerController;
use Illuminate\Support\Facades\Route;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\DebugModeCheck;
use Spatie\Health\Checks\Checks\EnvironmentCheck;
use Spatie\Health\Checks\Checks\PingCheck;
use Spatie\Health\Checks\Checks\UsedDiskSpaceCheck;
use Spatie\Health\Facades\Health;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

require __DIR__ . '/auth.php';

Route::middleware(['auth',  'verified'])->group(function () {
    Route::get('/', [HomeController::class,  'home'])->name('dashboard');

    Route::apiResource('posts', PostController::class);

    Route::post('/groups', [GroupController::class, 'create']);
    Route::get('/user/{user}', [MessageController::class, 'byUser'])->name('chat.user');
    Route::get('/group/{group}', [MessageController::class, 'byGroup'])->name('chat.user');
    Route::post('/message', [MessageController::class, 'store'])->name('message.store');
    Route::delete('/message/message', [MessageController::class, 'destroy'])->name('message.destroy');
    Route::get('/message/older/{message}', [MessageController::class, 'loadOlder'])->name('message.loadOlder');

    Route::post('/upload-{type}', [UserController::class, 'uploadAvatarOrBanner'])->name('profile.uploadImage');

    Route::post('/fanpages', [FanpageController::class, 'store'])->name('createFanpage');
    Route::get('/fanpages/{id}', [FanPageController::class, 'show'])->name('fanpages.show');
    Route::post('/fanpages/{fanpage}/upload-{type}', [FanpageController::class, 'uploadAvatarOrCoverImage'])->name('profile.uploadImage');

    Route::post('/fanpages/{fanpage}/follow', [FanpageFollowerController::class, 'follow'])->name('fanpages.follow');
    Route::delete('/fanpages/{fanpage}/unfollow', [FanpageFollowerController::class, 'unfollow'])->name('fanpages.unfollow');
    Route::get('/fanpages/{fanpage}/followers', [FanpageFollowerController::class, 'getFollowers'])->name('fanpages.followers');

    Route::post('/send-friend-request', [FriendRequestController::class, 'sendRequest'])->name('friends.request.send');
    Route::post('/cancel-friend-request', [FriendRequestController::class, 'cancelRequest'])->name('friends.request.cancel');
    Route::post('/accept-friend-request', [FriendRequestController::class,  'acceptFriendRequest'])->name('accept.friend.request');
    Route::post('/decline-friend-request', [FriendRequestController::class,  'declineFriendRequest'])->name('decline.friend.request');
    Route::post('/remove-friend', [FriendRequestController::class, 'removeFriend'])->name('remove.friend');

    Route::post('reaction', [ReactionController::class, 'store']);
    Route::delete('reaction', [ReactionController::class, 'destroy']);
    Route::get('reactions/{type}/{id}', [ReactionController::class, 'fetchReactions']);
    Route::get('reaction/check', [ReactionController::class, 'hasReacted']);

    Route::post('/posts/{post}/comments', [CommentController::class,  'postComment']);
    Route::get('/posts/{post}/comments', [CommentController::class, 'getCommentsForPost']);
    Route::post('/comments/{comment}/replies', [CommentController::class, 'replyToComment'])->name('comment.reply');
    Route::get('/{user}', [UserController::class, 'profile'])->name('user.profile');
});

Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/overview', [AdminDashboardController::class, 'getDashboardData']);
    Route::get('/users', [AdminUserManagementController::class, 'index'])->name('admin.users.index');
    Route::get('/contents', [AdminContentManagementController::class, 'index']);
    Route::get('/health', HealthCheckResultsController::class);
    Route::post('/users/set-inactive', [AdminUserManagementController::class, 'setInactive']);
    Route::post('/users/set-active', [AdminUserManagementController::class, 'setActive']);
    Route::post('/users/send-message', [AdminUserManagementController::class, 'sendMessage']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
