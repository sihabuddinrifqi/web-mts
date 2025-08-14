<?php

namespace App\Policies;

use App\Models\Izin;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class IzinPolicy
{

    /**
     * Determine whether the user can view the model.
     */
    public function before(User $user, $ability){
        
    }
    public function view(User $user, Izin $izin): bool
    {
        // return $user->id === $izin->created_by ||
        //     $user->id === $izin->targetSiswa?->id ||
        //     $user->id === $izin->opened_by;
        return true;
    }

    public function update(User $user, Izin $izin)
    {
        return $user->role === 'guru' || $user->role === 'admin';
        // return true;
    }

    public function create(User $user)
    {
        return $user->role === 'walisiswa';
        // return true;
    }
}
