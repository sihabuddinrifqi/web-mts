<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Pelajaran;
use App\Models\Izin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function siswa()
    {
        $guruId = Auth::id();
        $siswa = Siswa::where('guru_id', $guruId)->get();
        return Inertia::render('guru/siswa', [
            'prop' => $siswa
        ]);
    }

    public function pelajaran(Request $request)
    {
        $semester = $request->query('semester');
        $guruId = Auth::id();
        $query = Pelajaran::query()->where('pengampu_id', $guruId);
        if ($semester) $query->where('semester', $semester);
        $pelajaran = $query->with('nilai')->get();
        return Inertia::render('guru/pelajaran', [
            'prop' => $pelajaran
        ]);
        $guru = auth()->user();
    
    $pelajaran = Pelajaran::where('guru_id', $guru->id)->get(); 

    return Inertia::render('Guru/Pelajaran', [
        'pelajaranData' => $pelajaran
    ]);
    }

    public function izin(Request $request)
    {
        $page = $request->query('page', 1);
        $guruId = Auth::id();
        $izin = Izin::whereHas('targetSiswa', function ($query) use ($guruId) {
                $query->where('guru_id', $guruId);
            })
            ->with(['createdBy', 'targetSiswa', 'openedBy'])
            ->paginate(10, ['*'], 'page', $page);
        return Inertia::render('guru/izin', [
            'prop' => $izin
        ]);
    }
}
