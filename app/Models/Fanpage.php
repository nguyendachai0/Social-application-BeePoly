<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fanpage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'cover_image',
        'avatar',
        'active',
    ];

    public function getAvatarAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null;
    }

    public function getCoverImageAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null;
    }

    /**
     * Define the relationship between a Fanpage and its creator (User).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Define the relationship between a Fanpage and its posts.
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'fanpage_followers', 'fanpage_id', 'user_id')
            ->withTimestamps();
    }
}
