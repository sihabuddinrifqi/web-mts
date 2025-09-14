<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\Pelajaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresensiViewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display presensi for admin
     */
    public function admin(Request $request)
    {
        // Ambil data presensi dengan relasi
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

        // Kelompokkan data berdasarkan siswa dan mata pelajaran
        $groupedPresensi = $presensi->getCollection()->groupBy(function ($item) {
            return $item->siswa_id . '-' . $item->pelajaran_id;
        })->map(function ($group) {
            $first = $group->first();
            return [
                'siswa' => $first->siswa,
                'pelajaran' => $first->pelajaran,
                'guru' => $first->guru,
                'presensi_data' => $group->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'tanggal' => $item->tanggal,
                        'status' => $item->status,
                        'keterangan' => $item->keterangan,
                    ];
                })->sortBy('tanggal')->values(),
                'total_hadir' => $group->where('status', 'hadir')->count(),
                'total_sakit' => $group->where('status', 'sakit')->count(),
                'total_izin' => $group->where('status', 'izin')->count(),
                'total_alpha' => $group->where('status', 'alpha')->count(),
                'total_presensi' => $group->count(),
            ];
        })->values();

        $pelajaran = Pelajaran::with('pengampu')->get();

        return Inertia::render('admin/presensi', [
            'presensi' => $presensi->setCollection($groupedPresensi),
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

    /**
     * Get presensi data for modal
     */
    public function modalData(Request $request)
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
            });

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

        $presensi = $query->orderBy('pelajaran_id')
            ->orderBy('siswa_id')
            ->orderBy('tanggal')
            ->get();

        // Kelompokkan data berdasarkan pelajaran dan siswa
        $groupedData = $presensi->groupBy('pelajaran_id')->map(function ($pelajaranGroup) {
            $firstPelajaran = $pelajaranGroup->first();
            return [
                'id' => $firstPelajaran->pelajaran->id,
                'nama_pelajaran' => $firstPelajaran->pelajaran->nama_pelajaran,
                'pengampu' => $firstPelajaran->guru,
                'siswa' => $pelajaranGroup->groupBy('siswa_id')->map(function ($siswaGroup) {
                    $firstSiswa = $siswaGroup->first();
                    return [
                        'id' => $firstSiswa->siswa->id,
                        'name' => $firstSiswa->siswa->name,
                        'nis' => $firstSiswa->siswa->nis,
                        'presensi' => $siswaGroup->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'tanggal' => $item->tanggal->format('Y-m-d'),
                                'status' => $item->status,
                                'keterangan' => $item->keterangan,
                            ];
                        })->values()->toArray(),
                    ];
                })->values()->toArray(),
            ];
        })->values()->toArray();

        return response()->json([
            'data' => $groupedData,
            'message' => 'Data presensi berhasil diambil'
        ]);
    }
}
