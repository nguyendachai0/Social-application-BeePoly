<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Share extends Model
{
    use HasFactory;
    protected $table = "shares";
    protected $fillable = ['user_id', 'post_id', 'recaption', 'shared_at'];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
    public function notifcations()
    {
        return $this->hasMany(Notification::class, 'share_id');
    }
}
