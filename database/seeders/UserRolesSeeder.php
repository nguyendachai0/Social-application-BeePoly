<?php

namespace Database\Seeders;

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

        // Fetch valid role IDs dynamically
        $validRoleIds = DB::table('roles')->whereIn('id', [2, 3])->pluck('id')->toArray();

        // Prepare the data for insertion
        $userRoles = [];
        foreach ($userIds as $userId) {
            $userRoles[] = [
                'user_id' => $userId,
                'role_id' => $validRoleIds[array_rand($validRoleIds)], // Randomly assign a valid role_id
            ];
        }

        // Insert the data into the user_roles table
        DB::table('user_roles')->insert($userRoles);
    }
}
