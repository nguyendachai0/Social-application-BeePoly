<?php

namespace App\Http\Controllers;

use App\Models\Fanpage;
use Illuminate\Http\Request;

class FanpageFollowerController extends Controller
{
    public function follow(Fanpage $fanpage)
    {
        $user = auth()->user();

        if ($user->followedFanpages()->where('fanpage_id', $fanpage->id)->exists()) {
            return response()->json(['message' => 'Already following'], 400);
        }

        $user->followedFanpages()->attach($fanpage->id);

        return response()->json(['message' => 'Followed successfully']);
    }

    // Unfollow a fan page
    public function unfollow(Fanpage $fanpage)
    {
        $user = auth()->user();

        if (!$user->followedFanpages()->where('fanpage_id', $fanpage->id)->exists()) {
            return response()->json(['message' => 'Not following'], 400);
        }

        $user->followedFanpages()->detach($fanpage->id);

        return response()->json(['message' => 'Unfollowed successfully']);
    }

    public function getFollowers(Fanpage $fanpage)
    {
        $followers = $fanpage->followers()->select('id', 'name', 'email')->get();

        return response()->json($followers);
    }
}
