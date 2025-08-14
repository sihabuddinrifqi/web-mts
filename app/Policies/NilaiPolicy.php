<?php

namespace App\Policies;

use App\Models\Nilai;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Log;

class NilaiPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Nilai $nilai): Response
    {
        if($nilai->pelajaran->guru_id === $user->id) 
            return Response::allow();
        if($nilai->siswa->ortu_id === $user->id) 
            return Response::allow();
        if($user->role === 'admin') 
            return Response::allow();
        return Response::deny('You are not allowed to view this nilai.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Nilai $nilai): Response
    {
        return $nilai->pelajaran->guru_id === $user->id
            ? Response::allow()
            : Response::deny('You are not allowed to edit this Nilai.');
    }
    
    public function delete(User $user): Response
    {
        return $user->role === 'admin' ? Response::allow() : Response::deny("Access denied");
    }
}
