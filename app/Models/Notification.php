<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $table = "notifications";
    protected $fillable = ["user_id", "friend_request_id", "post_id", "comment_id", "message_id", "group_id", "status"];
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
}
