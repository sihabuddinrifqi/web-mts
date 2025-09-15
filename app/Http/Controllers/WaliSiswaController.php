<?php

namespace App\Http\Controllers;

use App\Models\Izin;
use App\Models\User;
use App\Models\WaliSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WalisiswaController extends Controller
{
    public function index(Request $request)
    {
        $wali = Auth::id();

        // Ambil anak dari tabel users berdasarkan ortu_id
        $siswa = User::where('ortu_id', $wali);

        $search = $request->query('search');
        if ($search) {
            $siswa = $siswa->where('name', 'like', "%{$search}%");
        }

        return Inertia::render('walisiswa/anak', [
            'prop' => $siswa->paginate(10, ['*'], 'page', $request->query('page', 1))
        ]);
    }

    public function APIanak()
    {
        $wali = Auth::id();

        // Ambil anak dari tabel users berdasarkan ortu_id
        $siswa = User::where('ortu_id', $wali)->get();
        $count = $siswa->count();

        return response()->json([
            'message' => $count > 0 ? 'successfully walisiswa\'s anak' : 'data not found',
            'received' => $count,
            'data' => $siswa
        ], $count > 0 ? 200 : 404);
    }

    public function izin(Request $request)
{
    $waliId = Auth::id();

    // ambil semua izin
    $izin = Izin::where('created_by', $waliId)
        ->with(['createdBy', 'targetSiswa'])
        ->paginate(10, ['*'], 'page', $request->query('page', 1));

    // ambil daftar anak si wali
    $anak = User::where('ortu_id', $waliId)->get();

    return Inertia::render('walisiswa/izin', [
        'prop' => $izin,
        'anak' => $anak, // lempar ke frontend
    ]);
}

    public function store_izin(Request $request)
        {
            $validated = $request->validate([
                'created_by' => 'required|integer',
                'target_siswa_id' => 'required|integer|exists:users,id',
                'message' => 'required|string|max:500',
                'tanggal_pulang' => 'required|date',
                'tanggal_kembali' => 'required|date|after_or_equal:tanggal_pulang',
            ]);

            Izin::create($validated);

            return redirect()->route('wali.izin')
                            ->with('success', 'Izin berhasil ditambahkan.');
        }

    public function create_izin_form()
    {
        $waliId = Auth::id();
        $anak = User::where('ortu_id', $waliId)->get();
        
        return Inertia::render('walisiswa/izin-create', [
            'anak' => $anak
        ]);
    }

    public function create_izin(Request $request, WaliSiswa $walisiswa)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:500',
            'target_siswa_id' => 'required|int',
            'created_by' => 'required|int',
            'tanggal_pulang' => 'required|date',
            'tanggal_kembali' => 'required|date'
        ]);

        Izin::create($validated);

        return redirect()->route('wali.izin');
    }

    public function show_izin(Izin $izin)
    {
        // Check if the user owns this izin
        if ($izin->created_by !== Auth::id()) {
            return redirect()->back()->with('error', 'Anda tidak memiliki izin untuk melihat data ini.');
        }

        return Inertia::render('walisiswa/izin-show', [
            'izin' => $izin->load(['createdBy', 'targetSiswa'])
        ]);
    }

    public function destroy_izin(Izin $izin)
    {
        if ($izin->created_by !== Auth::id()) {
            return redirect()->back()->with('error', 'Anda tidak memiliki izin untuk melakukan aksi ini.');
        }
        
        if ($izin->status !== null) {
            return redirect()->back()->with('error', 'Izin yang sudah diproses tidak dapat dihapus.');
        }

        $izin->delete();

        return redirect()->route('wali.izin')->with('success', 'Pengajuan izin berhasil dihapus.');
    }
}
