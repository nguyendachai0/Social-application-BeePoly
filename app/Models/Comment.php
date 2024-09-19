<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $table = 'comments';
    protected $fillable = ['comment', 'story_id', 'user_id', 'post_id', 'parent_comment_id'];
    public function user()
    {
        return $this->belongsTo(User::class, 'profile_user_id');
    }
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_comment_id');
    }
    public function children()
    {
        return $this->hasMany(Comment::class, 'parent_comment_id');
    }
    public function notifcations()
    {
        return $this->hasMany(Notification::class, 'reference');
    }
    public function reactions()
    {
        return $this->hasMany(Reaction::class, 'comment_id');
    }
    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }
}
