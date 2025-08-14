<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pelajaran>
 */
class PelajaranFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'nama_pelajaran' => $this->faker->word . ' Studies',
            'semester' => rand(1, 6),
            'pengampu_id' => User::where('role', 'guru')->inRandomOrder()->first()->id ?? 1,
            'waktu' => $this->faker->time()
        ];
    }
}
