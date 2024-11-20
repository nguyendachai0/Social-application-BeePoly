<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $months = range(1, 12); // Months from January to December
        $year = now()->year;

        foreach ($months as $month) {
            $usersToCreate = rand(5, 20); // Random number of users for each month

            for ($i = 0; $i < $usersToCreate; $i++) {
                User::factory()->create([
                    'created_at' => Carbon::create($year, $month, rand(1, 28), rand(0, 23), rand(0, 59), rand(0, 59)),
                ]);
            }
        }
    }
}
