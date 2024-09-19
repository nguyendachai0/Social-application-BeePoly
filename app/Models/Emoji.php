<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emoji extends Model
{
    use HasFactory;
    protected $table = "emojis";
    protected $fillable = ['type_emoji'];
    public function reactions()
    {
        return $this->hasMany(Reaction::class, 'emoji_id');
    }
}
