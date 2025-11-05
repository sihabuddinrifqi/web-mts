<?php

namespace App\Http\Controllers;

use App\Models\Izin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class IzinManagerController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('admin/izin', [
            'prop' => Izin::paginateWithSearch($request)
        ]);
    }

    /**
     * [PERBAIKAN] Memperbaiki alur logika untuk menyimpan data dan file.
     */
    public function store(Request $request)
    {
        // [1] Validasi semua data, termasuk foto.
        // Foto bersifat opsional (nullable), harus berupa gambar, dan ukurannya maksimal 5MB.
        $validated = $request->validate([
            'message' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'tanggal_pulang' => 'required|date',
            'tanggal_kembali' => 'required|date',
            'created_by' => 'required|integer|exists:users,id',
            'target_siswa_id' => 'required|integer|exists:users,id',
        ]);

        // [2] Cek apakah ada file foto yang diunggah.
        if ($request->hasFile('photo')) {
            // Simpan foto di dalam direktori 'public/uploads/izin' agar bisa diakses dari web.
            // Simpan path-nya ke dalam variabel.
            $path = $request->file('photo')->store('uploads/izin', 'public');
            
            // [3] Path sudah benar karena menggunakan disk 'public'.
            $validated['photo'] = '/storage/' . $path;
        }

        // [4] Simpan semua data yang sudah divalidasi ke database.
        Izin::create($validated);

        // [5] Kembalikan redirect setelah semuanya berhasil.
        return redirect()->back()->with('success', 'Izin berhasil diajukan.');
    }

    public function update(Request $request, Izin $izin)
    {
        Gate::authorize('update', $izin);
        $validated = $request->validate([
            'status' => ['required', Rule::in(['accepted', 'rejected'])]
        ]);
        $izin->update($validated);
        return response()->json([
            'message' => "successfully updated izin " . $izin->id,
            'received' => 1,
            'data' => $izin
        ]);
    }

    public function destroy(Izin $izin)
    {
        // Tambahkan logika untuk menghapus file foto jika ada
        if ($izin->photo) {
            // Hapus file dari storage
            $filePath = str_replace('/storage/', '', $izin->photo);
            if (\Storage::disk('public')->exists($filePath)) {
                \Storage::disk('public')->delete($filePath);
            }
        }
        $izin->delete();
        return redirect()->route('admin.izin.index');
    }
}
