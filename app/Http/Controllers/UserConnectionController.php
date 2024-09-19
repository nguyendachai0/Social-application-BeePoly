<?php

namespace App\Http\Controllers;

use App\Events\UserConnected;
use Illuminate\Http\Request;

class UserConnectionController extends Controller
{
    public function connectToChannel(Request $request)
    {
        $channelName = $request->channelName;
        $otherUserId = $request->otherUserId;
        event(new UserConnected($channelName, $otherUserId));
    }
}
