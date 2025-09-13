<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\Pelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresensiViewController extends Controller
{
    /**
     * Display presensi for admin
     */
    public function admin(Request $request)
    {
        $query = Presensi::with(['siswa', 'pelajaran', 'guru'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('siswa', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($request->pelajaran_id, function ($query, $pelajaranId) {
                $query->where('pelajaran_id', $pelajaranId);
            })
            ->when($request->tanggal, function ($query, $tanggal) {
                $query->whereDate('tanggal', $tanggal);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            });

        $presensi = $query->orderBy('tanggal', 'desc')
            ->orderBy('siswa_id')
            ->paginate(20);

        $pelajaran = Pelajaran::with('pengampu')->get();

        return Inertia::render('admin/presensi', [
            'presensi' => $presensi,
            'pelajaran' => $pelajaran,
            'filters' => $request->only(['search', 'pelajaran_id', 'tanggal', 'status'])
        ]);
    }

    /**
     * Display presensi for guru wali kelas
     */
    public function guru(Request $request)
    {
        $guruId = auth()->id();
        
        // Ambil siswa yang menjadi wali kelas dari guru ini
        $siswaWali = Siswa::where('guru_id', $guruId)->pluck('id');
        
        $query = Presensi::with(['siswa', 'pelajaran', 'guru'])
            ->whereIn('siswa_id', $siswaWali)
            ->when($request->search, function ($query, $search) {
                $query->whereHas('siswa', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($request->pelajaran_id, function ($query, $pelajaranId) {
                $query->where('pelajaran_id', $pelajaranId);
            })
            ->when($request->tanggal, function ($query, $tanggal) {
                $query->whereDate('tanggal', $tanggal);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            });

        $presensi = $query->orderBy('tanggal', 'desc')
            ->orderBy('siswa_id')
            ->paginate(20);

        $pelajaran = Pelajaran::with('pengampu')->get();

        return Inertia::render('guru/presensi', [
            'presensi' => $presensi,
            'pelajaran' => $pelajaran,
            'filters' => $request->only(['search', 'pelajaran_id', 'tanggal', 'status'])
        ]);
    }

    /**
     * Display presensi for wali siswa
     */
    public function walisiswa(Request $request)
    {
        $waliId = auth()->id();
        
        // Ambil siswa yang menjadi anak dari wali ini
        $siswaAnak = Siswa::where('ortu_id', $waliId)->pluck('id');
        
        $query = Presensi::with(['siswa', 'pelajaran', 'guru'])
            ->whereIn('siswa_id', $siswaAnak)
            ->when($request->search, function ($query, $search) {
                $query->whereHas('siswa', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($request->pelajaran_id, function ($query, $pelajaranId) {
                $query->where('pelajaran_id', $pelajaranId);
            })
            ->when($request->tanggal, function ($query, $tanggal) {
                $query->whereDate('tanggal', $tanggal);
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            });

        $presensi = $query->orderBy('tanggal', 'desc')
            ->orderBy('siswa_id')
            ->paginate(20);

        $pelajaran = Pelajaran::with('pengampu')->get();

        return Inertia::render('walisiswa/presensi', [
            'presensi' => $presensi,
            'pelajaran' => $pelajaran,
            'filters' => $request->only(['search', 'pelajaran_id', 'tanggal', 'status'])
        ]);
    }

    /**
     * Get presensi statistics
     */
    public function statistics(Request $request)
    {
        $query = Presensi::query();
        
        // Filter berdasarkan role
        if (auth()->user()->role === 'guru') {
            $guruId = auth()->id();
            $siswaWali = Siswa::where('guru_id', $guruId)->pluck('id');
            $query->whereIn('siswa_id', $siswaWali);
        } elseif (auth()->user()->role === 'walisiswa') {
            $waliId = auth()->id();
            $siswaAnak = Siswa::where('ortu_id', $waliId)->pluck('id');
            $query->whereIn('siswa_id', $siswaAnak);
        }

        // Filter berdasarkan tanggal
        if ($request->tanggal) {
            $query->whereDate('tanggal', $request->tanggal);
        } else {
            $query->whereDate('tanggal', now());
        }

        $total = $query->count();
        $hadir = $query->where('status', 'hadir')->count();
        $sakit = $query->where('status', 'sakit')->count();
        $izin = $query->where('status', 'izin')->count();
        $alpha = $query->where('status', 'alpha')->count();

        return response()->json([
            'total' => $total,
            'hadir' => $hadir,
            'sakit' => $sakit,
            'izin' => $izin,
            'alpha' => $alpha,
            'persentase_hadir' => $total > 0 ? round(($hadir / $total) * 100, 2) : 0
        ]);
    }
}
