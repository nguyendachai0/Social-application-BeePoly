<?php

use App\Events\UserConnected;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
use App\Events\UserConnectedToGroup;
use App\Models\Group;
use Illuminate\Support\Facades\Log;


Broadcast::channel('online', function ($user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel('message.user.{userId1}-{userId2}', function (User $user, int $userId1, int $userId2) {
    if ($user->id === $userId1 || $user->id === $userId2) {
        $otherUserId = $user->id === $userId1 ?  $userId2 : $userId1;
        event(new UserConnected("message.user.{$userId1}-{$userId2}", $otherUserId));
        return $user;
    }
    return null;
});

Broadcast::channel('message.group.{groupId}', function (User  $user, int $groupId) {
    if ($user->groups->contains('id', $groupId)) {
        $group = Group::find($groupId);
        $otherUsers = $group->users->filter(function ($groupUser) use ($user) {
            return $groupUser->id !== $user->id;
        });
        foreach ($otherUsers as $otherUser) {
            event(new UserConnected("message.group.{$groupId}", $otherUser->id));
        }

        return $user;
    }
    return null;
});

Broadcast::channel('user-connected.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('friend-request.user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
