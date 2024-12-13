<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'reporting_user_id',
        'reported_user_id',
        'reported_post_id',
        'reported_comment_id',
        'report_type',
        'details',
        'status',
    ];

    protected $casts = [
        'report_type' => 'string',
        'status' => 'string',
    ];

    public function reportingUser()
    {
        return $this->belongsTo(User::class, 'reporting_user_id');
    }

    public function reportedUser()
    {
        return $this->belongsTo(User::class, 'reported_user_id');
    }

    public function reportedPost()
    {
        return $this->belongsTo(Post::class, 'reported_post_id');
    }

    public function reportedComment()
    {
        return $this->belongsTo(Comment::class, 'reported_comment_id');
    }
}
