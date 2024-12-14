<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'avatar',
        'banner',
        'first_name',
        'last_name',
        'sur_name',
        'date_of_birth',
        'email',
        'email_verified_at',
        'password',
        'is_admin',
        'mobile',
        'gender',
        'avatar',
        'address'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function hasRole(string $role): bool
    {
        return $this->roles->contains('name', $role);
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_users');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'friend_requests', 'receiver_id', 'sender_id')
            ->wherePivotIn('status', ['rejected', 'pending']);
    }

    public function followedFanpages()
    {
        return $this->belongsToMany(Fanpage::class, 'fanpage_followers', 'user_id', 'fanpage_id')
            ->withTimestamps();
    }

    public function friendsOfThisUser()
    {
        return $this->belongsToMany(User::class, 'friend_requests', 'sender_id', 'receiver_id')
            ->withPivot('status')
            ->wherePivot('status', 'accepted');
    }

    protected function thisUserFriendOf()
    {
        return $this->belongsToMany(User::class, 'friend_requests', 'receiver_id', 'sender_id')
            ->withPivot('status')
            ->wherePivot('status', 'accepted');
    }

    protected function getFriendsAttribute()
    {
        if (!array_key_exists('friends', $this->relations)) $this->loadFriends();
        return $this->getRelation('friends');
    }

    protected function loadFriends()
    {
        if (!array_key_exists('friends', $this->relations)) {
            $friends = $this->mergeFriends();
            $this->setRelation('friends', $friends);
        }
    }

    protected function mergeFriends()
    {
        $friendOfThisUser = ($this->friendsOfThisUser)  ?? collect();
        $thisUserFriendOf = ($this->thisUserFriendOf) ?? collect();
        return $friendOfThisUser->map(function (User $friendOfThisUser) {
            return $friendOfThisUser->toUserArray();
        })->concat($thisUserFriendOf->map(function (User $thisUserFriendOf) {
            return  $thisUserFriendOf->toUserArray();
        }));
    }

    public static function getUserExceptUser(User $user)
    {
        $userId = $user->id;
        $query = User::select(['users.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
            ->where('users.id', '!=', $userId)
            ->when(!$user->is_admin, function ($query) {
                $query->whereNull('users.blocked_at');
            })
            ->leftJoin('conversations', function ($join) use ($userId) {
                $join->on('conversations.user_id1', '=',  'users.id')
                    ->where('conversations.user_id2', '=', $userId)
                    ->orWhere(function ($query) use ($userId) {
                        $query->on('conversations.user_id2', '=', 'users.id')
                            ->where('conversations.user_id1', '=', $userId);
                    });
            })
            ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
            ->where('users.id', '!=', $userId)
            ->whereNotNull('messages.id')
            ->orderByRaw('IFNULL(users.blocked_at, 1)')
            ->orderBy('messages.created_at',  'desc')
            ->orderBY('users.first_name');

        return $query->get();
    }

    public function toConversationArray()
    {
        return  [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'sur_name' => $this->sur_name,
            'name' => $this->fullName,
            'is_group' => false,
            'is_user' => true,
            'is_admin' =>  (bool) $this->is_admin,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'blocked_at' => $this->blocked_at,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date ? ($this->last_message_date) : null,
        ];
    }

    public function  toUserArray()
    {
        return [
            'id' =>  $this->id,
            'email' => $this->email,
            'date_of_birth' => $this->date_of_birth,
            'avatar' => $this->avatar,
            'active' => $this->active,
            'banner'  => $this->banner,
            'first_name'  => $this->first_name,
            'last_name' => $this->last_name,
            'sur_name' => $this->sur_name,
            'created_at' => $this->created_at->format('F j, Y g:i A'),
            'roles' => $this->roles->pluck('name'),
        ];
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->sur_name;
    }

    public function getAvatarAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null;
    }

    public function getBannerAttribute($value)
    {
        return $value ? ('storage/' . $value) : null;
    }

    public function fanpages()
    {
        return $this->hasMany(Fanpage::class);
    }

    public static function getFriendsWithoutConversation(User $user)
    {
        $userId = $user->id;

        return User::select('users.*')
            ->join('friend_requests', function ($join) use ($userId) {
                $join->on('friend_requests.sender_id', '=', 'users.id')
                    ->orWhere('friend_requests.receiver_id', '=', 'users.id');
            })
            ->where(function ($query) use ($userId) {
                $query->where('friend_requests.receiver_id', '=', $userId)
                    ->orWhere('friend_requests.sender_id', '=', $userId);
            })
            ->where('users.id', '!=', $userId) // Exclude the current user
            ->whereNotExists(function ($query) use ($userId) {
                $query->select(DB::raw(1))
                    ->from('conversations')
                    ->where(function ($subquery) use ($userId) {
                        $subquery->whereColumn('conversations.user_id1', '=', 'users.id')
                            ->where('conversations.user_id2', '=', $userId)
                            ->orWhere(function ($subsubquery) use ($userId) {
                                $subsubquery->whereColumn('conversations.user_id2', '=', 'users.id')
                                    ->where('conversations.user_id1', '=', $userId);
                            });
                    });
            })
            ->orderBy('users.first_name') // Optional: Sort by name
            ->get();
    }
}
