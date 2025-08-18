<?php

namespace App\Http\Controllers;

use App\Models\Nilai;
use App\Models\Pelajaran;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Barryvdh\DomPDF\Facade\Pdf; // Import the PDF facade
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class NilaiController extends Controller
{
    // ... metode index(), generatePDF(), APIsiswa(), APIpelajaran() tetap sama ...
    public function index()
    {
        
    }

   public function generatePDF(Int $nis)
{
    // 1. Tambahkan 'nilai.detail' untuk memuat data UH, PTS, PAS
    $siswa = Siswa::where('nis', $nis)->with('nilai.pelajaran', 'nilai.detail')->first();

    if(!$siswa) {
        // Sebaiknya kembalikan halaman error atau pesan yang jelas
        abort(404, 'Siswa dengan NIS tersebut tidak ditemukan.');
    }

    // 2. Proses data nilai untuk ditampilkan di PDF
    $processedNilai = $siswa->nilai->map(function ($nilai) {
        // Cari nilai UH, PTS, PAS dari relasi 'detail'
        // Jika tidak ada detail, nilai default adalah 0
        $uh = $nilai->detail->firstWhere('jenis', 'UH')->nilai ?? 0;
        $pts = $nilai->detail->firstWhere('jenis', 'PTS')->nilai ?? 0;
        $pas = $nilai->detail->firstWhere('jenis', 'PAS')->nilai ?? 0;

        // Hitung nilai akhir (contoh: rata-rata, bisa disesuaikan)
        $nilaiAkhir = round(($uh + $pts + $pas) / 3, 2);

        return [
            'name'        => $nilai->pelajaran->nama_pelajaran,
            'semester'    => $nilai->semester,
            'uh'          => $uh,
            'pts'         => $pts,
            'pas'         => $pas,
            'nilai_akhir' => $nilaiAkhir,
        ];
    });

    // 3. Hitung rata-rata keseluruhan dari nilai akhir
    $rataRataKeseluruhan = $processedNilai->avg('nilai_akhir');

    $data = [
        'title'    => 'Transkrip Nilai',
        'date'     => date('d/m/Y'),
        'student'  => [
            'name'       => $siswa->name,
            'nis'        => $siswa->nis,
            'birth_info' => $siswa->tempat_lahir . '/' . $siswa->tanggal_lahir,
            'gender'     => $siswa->jenis_kelamin,
        ],
        'subjects' => $processedNilai, // Gunakan data yang sudah diproses
        'average'  => round($rataRataKeseluruhan, 2), // Gunakan rata-rata yang baru
    ];

    $pdf = PDF::loadView('transcript', $data);
    $pdf->setPaper('A4', 'portrait');
    return $pdf->download("transkrip-nilai-{$nis}.pdf");
}

    public function APIsiswa(Siswa $siswa)
    {
        Gate::authorize('viewNilai', $siswa);
        $siswa->load('nilai.pelajaran', 'nilai.detail');
        return response()->json([
            'message' => 'successfully received siswa with nilai',
            'received' => 1,
            'data' => $siswa
        ]);
    }

    public function APIpelajaran(Pelajaran $pelajaran)
    {
        return response()->json($pelajaran->load('nilai'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'pelajaran_id'   => 'required|integer|exists:pelajarans,id', // Ganti 'pelajarans' jika nama tabel berbeda
        'semester'       => 'required|integer|min:1',
        'ulangan_harian' => 'required|numeric|min:0|max:100',
        'pts'            => 'required|numeric|min:0|max:100',
        'pas'            => 'required|numeric|min:0|max:100',
        'siswa_id' => [
            'required',
            'integer',
            // Periksa tabel 'users', kolom 'id', DAN pastikan kolom 'role' bernilai 'siswa'
            Rule::exists('users', 'id')->where(function ($query) {
                return $query->where('role', 'siswa');
            }),
        ],
    ]);
    try {
        // 2. Buat atau temukan record Nilai utama
        $nilai = Nilai::firstOrCreate(
            [
                'siswa_id' => $validated['siswa_id'],
                'pelajaran_id' => $validated['pelajaran_id'],
                'semester' => $validated['semester'],
            ]
        );

        // 3. Siapkan data detail nilai
        $detail = [
            ['jenis' => 'UH', 'nilai' => $validated['ulangan_harian']],
            ['jenis' => 'PTS', 'nilai' => $validated['pts']],
            ['jenis' => 'PAS', 'nilai' => $validated['pas']],
        ];

        // 4. Hapus detail lama dan buat yang baru untuk menghindari duplikat
        $nilai->detail()->delete();
        $nilai->detail()->createMany($detail);

        // 5. Berikan response sukses
        return response()->json([
            'message' => 'Nilai berhasil disimpan.',
            'data'    => $nilai->load('detail') // Kirim kembali data yang baru dibuat
        ], 201);

    } catch (\Exception $e) {
        // Jika terjadi error lain (misal database), catat dan kirim response error
        \Log::error('Gagal menyimpan nilai: ' . $e->getMessage());
        return response()->json([
            'message' => 'Terjadi kesalahan di server saat menyimpan nilai.'
        ], 500);
    }
}
    // ... sisa metode (show, edit, update, destroy) tetap sama ...
    public function show(Nilai $nilai)
    {
    }

    public function edit(Nilai $nilai)
    {
        //
    }

    public function update(Request $request, Nilai $nilai)
    {
        $validated = $request->validate(['nilai' => 'required|numeric|max:100|min:0']);
        $nilai->update($validated);
        return response()->json(
            [
                'message' => "successfully updated nilai " . $nilai->id,
                'received' => 0,
                'data' => null
            ]
        );
    }

    public function destroy(Nilai $nilai)
    {
        //
    }
}