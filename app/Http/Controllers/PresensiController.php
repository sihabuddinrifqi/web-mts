<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
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

public function getPresensiSiswa(Request $request, $siswa)
    {
        try {
            $siswa = Siswa::with('presensi.pelajaran')->findOrFail($siswa);
            return response()->json([
                'success' => true,
                'data' => $siswa,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data presensi: ' . $e->getMessage(),
            ], 500);
        }
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
    'siswa_id' => [
        'required',
        'integer',
        // Periksa tabel 'users' pada kolom 'id', DAN pastikan kolom 'role' adalah 'siswa'
        \Illuminate\Validation\Rule::exists('users', 'id')->where(function ($query) {
            return $query->where('role', 'siswa');
        }),
    ],
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
    'status' => 'required|in:hadir,izin,sakit,alpha',
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

    public function show($pelajaranId, $tanggal = null)
{
    $tanggal = $tanggal ?? now()->toDateString();

    $presensi = Presensi::with('siswa') 
        ->where('pelajaran_id', $pelajaranId)
        ->whereDate('tanggal', $tanggal)
        ->get();

    return response()->json($presensi);
}

public function siswaByPelajaran($pelajaranId)
{
    $pelajaran = Pelajaran::findOrFail($pelajaranId);
    return $pelajaran->siswa; // pastikan relasi ada di model
}

public function storeByPelajaran(Request $request, $pelajaranId)
{
    $data = $request->input('presensi'); // { siswa_id: "status", ... }

    foreach ($data as $siswaId => $status) {
        Presensi::updateOrCreate(
            [
                'siswa_id' => $siswaId,
                'pelajaran_id' => $pelajaranId,
                'tanggal' => now()->toDateString(),
            ],
            [
                'status' => $status,
            ]
        );
    }

    return response()->json(['message' => 'Presensi berhasil disimpan']);
}

public function storeApi(Request $request)
{
    $validated = $request->validate([
        'siswa_id' => [
            'required',
            'integer',
            \Illuminate\Validation\Rule::exists('users', 'id')->where('role', 'siswa'),
        ],
        'guru_id'      => 'required|integer|exists:users,id',
        'pelajaran_id' => 'required|integer|exists:pelajarans,id',
        'tanggal'      => 'required|date',
        'status'       => 'required|in:hadir,izin,sakit,alpha',
    ]);

    // Menggunakan updateOrCreate untuk menangani data baru atau yang sudah ada
    $presensi = Presensi::updateOrCreate(
        [
            'siswa_id'     => $validated['siswa_id'],
            'pelajaran_id' => $validated['pelajaran_id'],
            'tanggal'      => $validated['tanggal'],
        ],
        [
            'status'       => $validated['status'],
            'guru_id'      => $validated['guru_id'],
        ]
    );

    // Muat relasi siswa untuk dikirim kembali ke frontend
    $presensi->load('siswa');

    // Kembalikan respons JSON
    return response()->json([
        'message' => 'Presensi berhasil disimpan',
        'data'    => $presensi
    ], 200);
}



}
