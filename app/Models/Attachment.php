<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;

class Attachment extends Model
{
    use HasFactory;
    protected  $fillable = [
        'message_id',
        'comment_id',
        'name',
        'path',
        'mime',
        'size'
    ];
    public function getPathAttribute()
    {
        return URL::to('storage/' . $this->attributes['path']);
    }
}
