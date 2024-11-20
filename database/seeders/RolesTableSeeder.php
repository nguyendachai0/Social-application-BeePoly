<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $roles = [
            [
                'name' => 'super_admin',
                'description' => 'Full control over the application',
            ],
            [
                'name' => 'moderator',
                'description' => 'Manage content, moderate discussions',
            ],
            [
                'name' => 'support',
                'description' => 'Help users, manage reports',
            ],
            [
                'name' => 'user',
                'description' => 'Regular user, the default role',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                ['description' => $role['description']]
            );
        }
    }
}
