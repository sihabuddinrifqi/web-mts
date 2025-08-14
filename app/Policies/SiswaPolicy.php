<?php

namespace App\Policies;

use App\Models\Siswa;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SiswaPolicy
{

    public function viewNilai(User $user, Siswa $siswa) {
        if ($user->id === $siswa->ortu_id) {
            return Response::allow();
        }
        if ($user->id === $siswa->guru_id) {
            return Response::allow();
        }
        if ($user->role === 'admin') {
            return Response::allow();
        }
        return Response::deny("You're not allowed to view this nilai");
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Siswa $siswa): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Siswa $siswa): bool
    {
        return $user->role === 'admin';
    }
}
