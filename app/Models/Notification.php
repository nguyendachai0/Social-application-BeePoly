<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Notification extends Model
{
    use HasFactory;

    protected $table = "notifications";
    protected $fillable = ["user_id", "friend_request_id", "post_id", "comment_id", "message_id", "group_id", "reaction_id", "status"];

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function friend_request()
    {
        return $this->belongsTo(FriendRequest::class, 'friend_request_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function comment()
    {
        return $this->belongsTo(Comment::class, 'comment_id');
    }

    public function message()
    {
        return $this->belongsTo(Message::class, 'message_id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function reaction()
    {
        return $this->belongsTo(Reaction::class, 'reaction_id');
    }

    public function generateContent()
    {
        if ($this->post_id) {
            return "liked your post";
        } elseif ($this->comment_id) {
            return "commented on your photo";
        } elseif ($this->friend_request_id) {
            return "sent you a friend request";
        } elseif ($this->message_id) {
            return "sent you a message";
        } elseif ($this->group_id) {
            return "invited you to a group";
        } elseif ($this->reaction_id) {
            return "Liked your post";
        } else {
            return "has a new notification";
        }
    }

    public function getType()
    {
        if ($this->post_id) {
            return 'post';
        } elseif ($this->comment_id) {
            return 'comment';
        } elseif ($this->message_id) {
            return 'message';
        } elseif ($this->reaction_id) {
            return 'reaction';
        }
        return 'general';  // Default type if none of the above
    }

    public static function loadNotificationsForUser(int $userId): array
    {
        $notifications = self::with([
            'post.user:id,first_name,sur_name,avatar',
            'comment.user:id,first_name,sur_name,avatar',
            'message.user:id,first_name,sur_name,avatar',
            'reaction.user:id,first_name,sur_name,avatar',
        ])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Log::info([$notifications]);

        return $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->getType(),
                'user' => $notification->post->user ?? $notification->comment->user ?? $notification->message->user ?? $notification->reaction->user,
                'content' => $notification->generateContent(),
                'time' => Carbon::parse($notification->created_at)->diffForHumans(),
                'read' => $notification->status === 'read',
            ];
        })->toArray();
    }
}
