<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reaction extends Model
{
    use HasFactory;
    protected $table = "reactions";
    protected $fillable = ["user_id", 'post_id', 'emoji_id', "share_id", "story_id", "comment_id", "message_id"];
    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
    public function emoji()
    {
        return $this->belongsTo(Emoji::class, 'emoji_id');
    }
    public function story()
    {
        return $this->belongsTo(Story::class, 'story_id');
    }
    public function comment()
    {
        return  $this->belongsTo(Comment::class, 'comment_id');
    }
    public function share()
    {
        return $this->belongsTo(Share::class, 'share_id');
    }
    public function message()
    {
        return $this->belongsTo(Message::class, 'message_id');
    }
    public function notifcations()
    {
        return $this->hasMany(Notification::class);
    }
}
