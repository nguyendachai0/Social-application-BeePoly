<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $table = 'posts';
    protected $fillable = ['user_id', 'caption', 'fanpage_id'];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function reactions()
    {
        return $this->hasMany(Reaction::class, 'post_id');
    }
    public function comments()
    {
        return $this->hasMany(Comment::class, 'post_id');
    }
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'post_id');
    }
    public function attachments()
    {
        return $this->hasMany(Attachment::class, 'post_id');
    }

    public function fanpage()
    {
        return $this->belongsTo(Fanpage::class);
    }

    public function tags()
    {
        return $this->hasMany(PostTag::class);
    }

    public function taggedUsers()
    {
        return $this->belongsToMany(User::class, 'post_tags', 'post_id', 'user_id');
    }
}
