<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth',  'verified'])->group(function () {
    Route::get('/', [HomeController::class,  'home'])->name('dashboard');
    Route::get('/user/{user}', [MessageController::class, 'byUser'])->name('chat.user');
    Route::get('/group/{group}', [MessageController::class, 'byGroup'])->name('chat.user');
    Route::post('/message', [MessageController::class, 'store'])->name('message.store');
    Route::delete('/message/message', [MessageController::class, 'destroy'])->name('message.destroy');
    Route::get('/message/older/{message}', [MessageController::class, 'loadOlder'])->name('message.loadOlder');
    Route::get('profile/{user}', [UserController::class, 'profile'])->name('user.profile');
    Route::post('/profile/upload-image', [UserController::class, 'uploadImage'])->name('profile.uploadImage');
    Route::post('/send-friend-request', [FriendRequestController::class, 'sendRequest'])->name('friends.request.send');
    Route::post('/cancel-friend-request', [FriendRequestController::class, 'cancelRequest'])->name('friends.request.cancel');
    Route::post('/accept-friend-request', [FriendRequestController::class,  'acceptFriendRequest'])->name('accept.friend.request');
    Route::post('/decline-friend-request', [FriendRequestController::class,  'declineFriendRequest'])->name('decline.friend.request');
    Route::post('/remove-friend', [FriendRequestController::class, 'removeFriend'])->name('remove.friend');
    Route::apiResource('posts', PostController::class);
    Route::post('reaction', [ReactionController::class, 'store']);
    Route::delete('reaction', [ReactionController::class, 'destroy']);
    Route::get('reactions/{type}/{id}', [ReactionController::class, 'fetchReactions']);
    Route::get('reaction/check', [ReactionController::class, 'hasReacted']);
    Route::post('/posts/{post}/comments', [CommentController::class,  'postComment']);
    Route::get('/posts/{post}/comments', [CommentController::class, 'getCommentsForPost']);
    Route::post('/comments/{comment}/replies', [CommentController::class, 'replyToComment'])->name('comment.reply');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
require __DIR__ . '/auth.php';
