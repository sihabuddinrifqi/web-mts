<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Pelajaran;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PresensiController extends Controller
{
    /**
     * Tampilkan daftar presensi
     */
    public function index(Request $request)
{
    $query = Pelajaran::with(['nilai', 'siswa'])
        ->when($request->search, function($q) use ($request) {
            $q->where('nama_pelajaran', 'like', '%' . $request->search . '%');
        });

    $siswaData = $query->paginate(10);

    return Inertia::render('Admin/SiswaPage', [
        'siswaData' => $siswaData,
        'filters' => $request->only(['search', 'page']),
    ]);
}


    /**
     * Form input presensi
     */
    public function create()
    {
        $pelajarans = Pelajaran::all();
        $siswas = Siswa::all();
        return view('presensi.create', compact('pelajarans', 'siswas'));
    }

    /**
     * Simpan presensi
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'siswa_id'     => 'required|exists:users,id',
        'guru_id'      => 'required|exists:users,id',
        'pelajaran_id' => 'required|exists:pelajarans,id',
        'tanggal'      => 'required|date',
        'status'       => 'required|in:hadir,izin,sakit,alpha',
    ]);

    Presensi::create($validated);

    return redirect()->back()->with('success', 'Presensi berhasil disimpan');
}

    /**
     * Edit presensi
     */
    public function edit(Presensi $presensi)
    {
        $pelajarans = Pelajaran::all();
        $siswas = Siswa::all();
        return view('presensi.edit', compact('presensi', 'pelajarans', 'siswas'));
    }

    /**
     * Update presensi
     */
    public function update(Request $request, Presensi $presensi)
    {
        $request->validate([
            'status' => 'required|in:Hadir,Izin,Sakit,Alpa',
        ]);

        $presensi->update([
            'status' => $request->status,
        ]);

        return redirect()->route('presensi.index')->with('success', 'Presensi berhasil diperbarui.');
    }

    /**
     * Hapus presensi
     */
    public function destroy(Presensi $presensi)
    {
        $presensi->delete();
        return redirect()->route('presensi.index')->with('success', 'Presensi berhasil dihapus.');
    }
}
