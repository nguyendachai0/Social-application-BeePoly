<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\FriendRequest;
use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use App\Models\Post;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'first_name' => 'John',
            'last_name'  => 'Doe',
            'sur_name' => 'Doe',
            'email'  => 'john@example.com',
            'password'  => bcrypt('password'),
        ]);

        User::factory()->create([
            'first_name' => 'Jane',
            'last_name'  => 'Doe',
            'sur_name' => 'Doe',
            'email' => 'jane@example.com',
            'password' => bcrypt('password'),
        ]);

        User::factory(10)->create();

        for ($i = 0; $i < 5; $i++) {
            $group  = Group::factory()->create([
                'owner_id' => 1,
            ]);
            $users = User::inRandomOrder()->limit(rand(2, 5))->pluck('id');
            $group->users()->attach(array_unique([1, ...$users]));
        }




        Message::factory(1000)->create();
        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();

        $conversations = $messages->groupBy(function ($message) {
            return collect([$message->sender_id,  $message->receiver_id])->sort()->implode('_');
        })->map(function ($groupedMessages) {
            return [
                'user_id1' => $groupedMessages->first()->sender_id,
                'user_id2' => $groupedMessages->first()->receiver_id,
                'last_message_id' => $groupedMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at'   => new Carbon(),
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());

        for ($i = 0; $i < 20; $i++) {
            FriendRequest::factory()->create([
                'sender_id' => User::inRandomOrder()->first()->id,
                'receiver_id' => User::inRandomOrder()->first()->id,
                'status' => 'pending',
            ]);
        }

        // Create posts
        Post::factory(50)->create();
    }
}
