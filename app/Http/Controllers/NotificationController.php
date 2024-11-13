<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAsRead(Request $request)
    {
        $notificationIds = $request->input('notification_ids');
        Notification::whereIn('id', $notificationIds)->update(['status' => 'read']);

        return response()->json(['message' => 'Notifications marked as read']);
    }
}
