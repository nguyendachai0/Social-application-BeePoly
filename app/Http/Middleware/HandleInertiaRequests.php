<?php

namespace App\Http\Middleware;

use App\Models\Conversation;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;


class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user =  $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'csrfToken' => csrf_token(),
            'conversations' => Auth::id() ? Conversation::getConversationsForSideBar(Auth::user()) : [],
            'friends' =>  $user ? $user->friends : [],
            'notifications' => $user ? Notification::loadNotificationsForUser($user->id) : [],

        ];
    }
}
