<?php

namespace App\Http\Controllers;

use App\Models\Nilai;
use App\Models\Siswa;
use App\Models\Pelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NilaiViewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display nilai for admin
     */
    public function admin(Request $request)
    {
        $query = Nilai::with(['siswa', 'pelajaran'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('siswa', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($request->pelajaran_id, function ($query, $pelajaranId) {
                $query->where('pelajaran_id', $pelajaranId);
            })
            ->when($request->semester, function ($query, $semester) {
                $query->where('semester', $semester);
            });

        $nilai = $query->orderBy('semester', 'desc')
            ->orderBy('siswa_id')
            ->paginate(20);

        $pelajaran = Pelajaran::with('pengampu')->get();

        return Inertia::render('admin/nilai', [
            'nilai' => $nilai,
            'pelajaran' => $pelajaran,
            'filters' => $request->only(['search', 'pelajaran_id', 'semester'])
        ]);
    }

    /**
     * Display nilai for guru wali kelas
     */
    public function guru(Request $request)
    {
        $guruId = auth()->id();
        
        // Ambil siswa yang menjadi wali kelas dari guru ini
        $siswaWali = Siswa::where('guru_id', $guruId)->pluck('id');
        
        $query = Nilai::with(['siswa', 'pelajaran'])
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
            ->when($request->semester, function ($query, $semester) {
                $query->where('semester', $semester);
            });

        $nilai = $query->orderBy('semester', 'desc')
            ->orderBy('siswa_id')
            ->paginate(20);

        $pelajaran = Pelajaran::with('pengampu')->get();

        return Inertia::render('guru/nilai', [
            'nilai' => $nilai,
            'pelajaran' => $pelajaran,
            'filters' => $request->only(['search', 'pelajaran_id', 'semester'])
        ]);
    }

    /**
     * Display nilai for wali siswa
     */
    public function walisiswa(Request $request)
    {
        $waliId = auth()->id();
        
        // Ambil siswa yang menjadi anak dari wali ini
        $siswaAnak = Siswa::where('ortu_id', $waliId)->pluck('id');
        
        $query = Nilai::with(['siswa', 'pelajaran'])
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
            ->when($request->semester, function ($query, $semester) {
                $query->where('semester', $semester);
            });

        $nilai = $query->orderBy('semester', 'desc')
            ->orderBy('siswa_id')
            ->paginate(20);

        $pelajaran = Pelajaran::with('pengampu')->get();

        return Inertia::render('walisiswa/nilai', [
            'nilai' => $nilai,
            'pelajaran' => $pelajaran,
            'filters' => $request->only(['search', 'pelajaran_id', 'semester'])
        ]);
    }

    /**
     * Get nilai statistics
     */
    public function statistics(Request $request)
    {
        $query = Nilai::query();
        
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

        // Filter berdasarkan semester
        if ($request->semester) {
            $query->where('semester', $request->semester);
        }

        $total = $query->count();
        $rataRata = $query->avg('nilai');
        $tertinggi = $query->max('nilai');
        $terendah = $query->min('nilai');

        // Kategori nilai
        $A = $query->where('nilai', '>=', 90)->count();
        $B = $query->whereBetween('nilai', [80, 89])->count();
        $C = $query->whereBetween('nilai', [70, 79])->count();
        $D = $query->whereBetween('nilai', [60, 69])->count();
        $E = $query->where('nilai', '<', 60)->count();

        return response()->json([
            'total' => $total,
            'rata_rata' => round($rataRata, 2),
            'tertinggi' => $tertinggi,
            'terendah' => $terendah,
            'kategori' => [
                'A' => $A,
                'B' => $B,
                'C' => $C,
                'D' => $D,
                'E' => $E
            ]
        ]);
    }
}
