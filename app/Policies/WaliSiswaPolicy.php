<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WaliSiswa;
use Illuminate\Auth\Access\Response;

class WaliSiswaPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role == 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, WaliSiswa $waliSiswa): bool
    {
        return $user->role == 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, WaliSiswa $waliSiswa): bool
    {
        return $this->update($user, $waliSiswa);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, WaliSiswa $waliSiswa): bool
    {
        return false;
    }
}
