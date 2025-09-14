<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Presensi;
use App\Models\Pelajaran;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

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
    $siswa = $pelajaran->siswa()->with(['presensi' => function($query) use ($pelajaranId) {
        $query->where('pelajaran_id', $pelajaranId);
    }])->get();
    
    // Transform data to match frontend expectations
    $transformedData = $siswa->map(function($s) {
        return [
            'id' => $s->id,
            'name' => $s->name,
            'nis' => $s->nis,
            'presensi' => $s->presensi->map(function($p) {
                return [
                    'id' => $p->id,
                    'tanggal' => $p->tanggal,
                    'status' => $p->status,
                    'keterangan' => $p->keterangan
                ];
            })
        ];
    });
    
    return response()->json($transformedData);
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

/**
 * Generate PDF for presensi data
 */
public function generatePDF(Request $request, $pelajaranId = null)
{
    $pelajaran = null;
    $presensiData = [];
    $dates = [];
    $periode = '';
    
    if ($pelajaranId) {
        // Generate PDF for specific pelajaran
        $pelajaran = Pelajaran::findOrFail($pelajaranId);
        $siswa = $pelajaran->siswa()->with(['presensi' => function($query) use ($pelajaranId) {
            $query->where('pelajaran_id', $pelajaranId);
        }])->get();
        
        // Get all unique dates from presensi data
        $allDates = collect();
        foreach ($siswa as $s) {
            foreach ($s->presensi as $p) {
                $allDates->push($p->tanggal);
            }
        }
        $dates = $allDates->unique()->sort()->values()->toArray();
        
        // Format dates for display
        $dates = array_map(function($date) {
            return date('d/m', strtotime($date));
        }, $dates);
        
        // Process presensi data
        $presensiData = $siswa->map(function($s) use ($dates) {
            $presensiMap = [];
            foreach ($s->presensi as $p) {
                $dateKey = date('d/m', strtotime($p->tanggal));
                $presensiMap[$dateKey] = $p->status;
            }
            
            return [
                'id' => $s->id,
                'nis' => $s->nis,
                'name' => $s->name,
                'presensi' => $presensiMap
            ];
        })->toArray();
        
        $periode = $pelajaran->nama_pelajaran;
    } else {
        // Generate PDF for all presensi (admin view)
        $query = Presensi::with(['siswa', 'pelajaran']);
        
        if ($request->pelajaran_id) {
            $query->where('pelajaran_id', $request->pelajaran_id);
        }
        if ($request->tanggal) {
            $query->whereDate('tanggal', $request->tanggal);
        }
        
        $presensi = $query->get();
        
        // Group by siswa and date
        $groupedData = [];
        foreach ($presensi as $p) {
            $siswaId = $p->siswa_id;
            $tanggal = date('d/m', strtotime($p->tanggal));
            
            if (!isset($groupedData[$siswaId])) {
                $groupedData[$siswaId] = [
                    'id' => $p->siswa->id,
                    'nis' => $p->siswa->nis,
                    'name' => $p->siswa->name,
                    'presensi' => []
                ];
            }
            
            $groupedData[$siswaId]['presensi'][$tanggal] = $p->status;
        }
        
        $presensiData = array_values($groupedData);
        
        // Get all unique dates
        $allDates = $presensi->pluck('tanggal')->unique()->sort()->values();
        $dates = $allDates->map(function($date) {
            return date('d/m', strtotime($date));
        })->toArray();
        
        $periode = $request->pelajaran_id ? Pelajaran::find($request->pelajaran_id)->nama_pelajaran : 'Semua Mata Pelajaran';
    }
    
    // Calculate summary
    $summary = [
        'hadir' => 0,
        'sakit' => 0,
        'izin' => 0,
        'alpha' => 0,
        'total' => 0
    ];
    
    foreach ($presensiData as $siswa) {
        foreach ($siswa['presensi'] as $status) {
            $summary[$status]++;
            $summary['total']++;
        }
    }
    
    $data = [
        'title' => 'Laporan Presensi Siswa',
        'pelajaran_name' => $periode,
        'periode' => $periode,
        'print_date' => date('d/m/Y H:i'),
        'dates' => $dates,
        'presensi_data' => $presensiData,
        'summary' => $summary
    ];
    
    $pdf = Pdf::loadView('presensi', $data);
    $pdf->setPaper('A4', 'landscape');
    
    $filename = $pelajaranId ? 
        "presensi-{$pelajaran->nama_pelajaran}-" . date('Y-m-d') . ".pdf" :
        "presensi-laporan-" . date('Y-m-d') . ".pdf";
    
    return $pdf->download($filename);
}

/**
 * Generate PDF for presensi data by NIS
 */
public function generatePDFByNIS(Request $request, $nis)
{
    // Cari siswa berdasarkan NIS
    $siswa = \App\Models\Siswa::where('nis', $nis)
        ->with(['presensi.pelajaran']) // relasi presensi + pelajaran
        ->firstOrFail();

    // Ambil semua presensi siswa ini
    $presensi = $siswa->presensi;

    // Ambil semua tanggal unik
    $dates = $presensi->pluck('tanggal')->unique()->sort()->map(function($date) {
        return date('d/m', strtotime($date));
    })->toArray();

    // Mapping presensi berdasarkan tanggal
    $presensiMap = [];
    foreach ($presensi as $p) {
        $dateKey = date('d/m', strtotime($p->tanggal));
        $presensiMap[$dateKey] = $p->status;
    }

    // Hitung ringkasan
    $summary = [
        'hadir' => $presensi->where('status', 'hadir')->count(),
        'sakit' => $presensi->where('status', 'sakit')->count(),
        'izin'  => $presensi->where('status', 'izin')->count(),
        'alpha' => $presensi->where('status', 'alpha')->count(),
        'total' => $presensi->count(),
    ];

    $data = [
        'title' => 'Laporan Presensi Siswa',
        'siswa' => $siswa,
        'dates' => $dates,
        'presensi' => $presensiMap,
        'summary' => $summary,
        'print_date' => date('d/m/Y H:i'),
    ];

    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('presensi-nis', $data);
    $pdf->setPaper('A4', 'portrait');

    return $pdf->download("presensi-{$siswa->nis}-" . date('Y-m-d') . ".pdf");
}

}