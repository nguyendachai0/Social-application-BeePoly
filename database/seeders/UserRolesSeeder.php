<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = range(2, 80);

        // Prepare the data for insertion
        $userRoles = [];
        foreach ($userIds as $userId) {
            $userRoles[] = [
                'user_id' => $userId,
                'role_id' => rand(2, 3), // Randomly assign role_id 2 or 3
            ];
        }

        // Insert the data into the user_roles table
        DB::table('user_roles')->insert($userRoles);
    }
}
