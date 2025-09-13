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

    public function APIPresensi(Request $request, Pelajaran $pelajaran, $tanggal = null)
{
    // Ambil tanggal dari parameter route, default ke hari ini jika tidak ada
    $tanggal = $tanggal ?: now()->format('Y-m-d');

    // Ambil data siswa yang terdaftar di pelajaran ini
    // beserta data presensi mereka pada tanggal yang spesifik
    $dataPresensi = $pelajaran->siswa()->with(['presensi' => function ($query) use ($pelajaran, $tanggal) {
        $query->where('pelajaran_id', $pelajaran->id)
              ->whereDate('tanggal', $tanggal);
    }])->get();

    // Format data agar sesuai dengan yang diharapkan frontend
    $formattedData = $dataPresensi->map(function ($siswa) {
        $presensiHariIni = $siswa->presensi->first();
        return [
            'id' => $siswa->id, // atau ID unik lain jika perlu
            'siswa' => [
                'id' => $siswa->id,
                'name' => $siswa->name,
                'nis' => $siswa->nis,
            ],
            'status' => $presensiHariIni ? $presensiHariIni->status : 'alpha', // Default ke alpha jika belum ada data
            'keterangan' => $presensiHariIni ? $presensiHariIni->keterangan : null,
        ];
    });

    return response()->json([
        'message' => 'Berhasil mengambil data presensi',
        'data' => $formattedData
    ]);
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
