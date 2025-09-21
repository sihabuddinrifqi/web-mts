<?php

namespace App\Http\Controllers;

use App\Models\Nilai;
use App\Models\Pelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PelajaranManagerController extends Controller
{
    public function index(Request $request)
    {
        $query = Pelajaran::with('pengampu')
            ->withCount('siswa as siswa_count');

        $prop = $this->applySearchAndPaginate($query, $request, ['nama_pelajaran']);

        return Inertia::render('admin/pelajaran', [
            'prop' => $prop
        ]);
    }

    public function api(Request $request)
    {
        $query = Pelajaran::with('pengampu')->withCount('siswa as siswa_count');
        $data = $this->applySearchAndPaginate($query, $request, ['nama_pelajaran']);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pelajaran' => 'required|string|max:64',
            'semester' => 'required|integer',
            'pengampu_id' => 'required|integer',
            'siswa_ids' => 'required|array',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $pelajaran = Pelajaran::create([
                    'nama_pelajaran' => $validated['nama_pelajaran'],
                    'semester' => $validated['semester'],
                    'pengampu_id' => $validated['pengampu_id'],
                    'waktu' => now(),
                ]);

                $nilaiUntukDibuat = [];
                foreach ($validated['siswa_ids'] as $siswaId) {
                    $nilaiUntukDibuat[] = [
                        'pelajaran_id' => $pelajaran->id,
                        'siswa_id' => $siswaId,
                        'semester' => $pelajaran->semester,
                        'nilai' => 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($nilaiUntukDibuat)) {
                    Nilai::insert($nilaiUntukDibuat);
                }
            });

            return redirect()->route('admin.pelajaran.index')
                ->with('success', 'Pelajaran dan data nilai awal berhasil dibuat.');

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.')->withInput();
        }
    }

    public function edit(Pelajaran $pelajaran)
    {
        return Inertia::render('admin/pelajaran-edit', [
            'pelajaran' => $pelajaran->load('pengampu'),
            'selected_siswa_ids' => $pelajaran->siswa()->pluck('id'),
            'angkatan' => $pelajaran->siswa()->exists() ? $pelajaran->siswa()->first()->angkatan : null,
        ]);
    }

    public function update(Request $request, Pelajaran $pelajaran)
    {
        $validated = $request->validate([
            'nama_pelajaran' => 'required|string|max:64',
            'semester' => 'required|integer',
            'pengampu_id' => 'required|integer',
            'siswa_ids' => 'nullable|array',
        ]);

        try {
            DB::transaction(function () use ($validated, $pelajaran) {
                // update data dasar pelajaran
                $pelajaran->update([
                    'nama_pelajaran' => $validated['nama_pelajaran'],
                    'semester' => $validated['semester'],
                    'pengampu_id' => $validated['pengampu_id'],
                ]);

                // kalau siswa_ids ada di request → update siswa & nilai
                if (isset($validated['siswa_ids'])) {
                    // hapus nilai lama
                    Nilai::where('pelajaran_id', $pelajaran->id)->delete();

                    $nilaiUntukDibuat = [];
                    foreach ($validated['siswa_ids'] as $siswaId) {
                        $nilaiUntukDibuat[] = [
                            'pelajaran_id' => $pelajaran->id,
                            'siswa_id' => $siswaId,
                            'semester' => $pelajaran->semester,
                            'nilai' => 0,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }

                    if (!empty($nilaiUntukDibuat)) {
                        Nilai::insert($nilaiUntukDibuat);
                    }
                }
            });

            return redirect()->route('admin.pelajaran.index')
                ->with('success', 'Pelajaran berhasil diperbarui.');

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memperbarui data.')->withInput();
        }
    }

    public function destroy(Pelajaran $pelajaran)
    {
        $pelajaran->delete();
        return redirect()->route('admin.pelajaran.index');
    }

    // Helper untuk search + pagination
    private function applySearchAndPaginate($query, Request $request, array $searchable = [])
    {
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);
        $search = $request->query('search', '');

        if ($search && !empty($searchable)) {
            $query->where(function ($q) use ($search, $searchable) {
                foreach ($searchable as $field) {
                    $q->orWhere($field, 'like', "%{$search}%");
                }
            });
        }

        return $query->paginate($limit, ['*'], 'page', $page);
    }
}
