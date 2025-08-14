<?php

namespace App\Http\Controllers;

use App\Models\Nilai;
use App\Models\Pelajaran;
use Illuminate\Http\Request;

class PelajaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function APINilai(Pelajaran $pelajaran)
    {
        $query = Nilai::query()->where('pelajaran_id', $pelajaran->id)->with(['siswa']);
        $result = $query->get();
        return response()->json(
            [
                'message' => 'succesfully retrieved nilai data of pelajaran ' . $pelajaran->nama_pelajaran,
                'received' => $query->count(),
                'data' => $result
            ]
        );
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Pelajaran $pelajaran)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pelajaran $pelajaran)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pelajaran $pelajaran)
    {
        //
    }
}
