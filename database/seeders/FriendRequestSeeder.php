<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class FriendRequestSeeder extends Seeder
{
    public function run()
    {
        $statuses = ['pending', 'accepted', 'rejected'];

        for ($i = 0; $i < 20; $i++) {
            // Randomly decide whether sender_id or receiver_id will be 1
            $isSenderOne = rand(0, 1) === 0;

            FriendRequest::create([
                'sender_id' => $isSenderOne ? 1 : User::inRandomOrder()->first()->id,
                'receiver_id' => $isSenderOne ? User::inRandomOrder()->first()->id : 1,
                'status' => $statuses[array_rand($statuses)],
                'sent_at' => now(),
                'responded_at' => rand(0, 1) === 0 ? null : now(),
            ]);
        }
    }
}
