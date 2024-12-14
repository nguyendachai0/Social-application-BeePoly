<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\MessageNotification;

class AdminUserManagementController extends Controller
{
    public function index(Request $request)
    {
        $usersPerPage = $request->get('per_page', 10);
        Log::info($usersPerPage);

        if (!is_numeric($usersPerPage) || $usersPerPage <= 0) {
            $usersPerPage = 10;
        }

        $users = User::with('roles')
            ->select('id', 'first_name', 'sur_name', 'active', 'email', 'created_at')
            ->paginate($usersPerPage);

        $users->getCollection()->transform(function ($user) {
            return $user->toUserArray();
        });

        Log::info($users);

        return Inertia::render('AdminUserManagement', [
            'users' => $users,
            'dataUsersPerPage' => $usersPerPage
        ]);
    }
    // Set ngươi dùng không ko kích hoạthoạt
    public function setInactive(Request $request)
    {
        $userIds = $request->input('user_ids');

        User::whereIn('id', $userIds)->update(['active' => 0]);

        return redirect()->route('admin.users.index')->with('success', 'Users have been set as inactive');
    }

    public function setActive(Request $request)
    {
        $userIds = $request->input('user_ids');

        User::whereIn('id', $userIds)->update(['active' => 1]);

        return redirect()->route('admin.users.index')->with('success', 'Users have been set as active');
    }

    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        foreach ($validated['user_ids'] as $userId) {
            $user = User::find($userId);
            if ($user) {
                try {
                    Mail::to($user->email)->send(new MessageNotification($validated['subject'], $validated['message']));
                } catch (\Exception $e) {
                    Log::error("Failed to send message to user {$user->id}: " . $e->getMessage());
                }
            } else {
                Log::warning("User with ID {$userId} not found.");
            }
        }


        return redirect()->back()->with('success', 'Message sent successfully');
    }
}
