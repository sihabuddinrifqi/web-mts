<?php

namespace App\Http\Controllers;

use App\Models\Izin;
use App\Models\Siswa;
use App\Models\WaliSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WalisiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $wali = Auth::id();
        $siswa = Siswa::where('ortu_id', $wali);
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
        $siswa = Siswa::where('ortu_id', $wali)->get();
        $count = $siswa->count();
        return response()->json([
            'message' => $count > 0 ? 'successfulyy walisiswa\'s anak' : 'data not found',
            'received' => $count,
            'data' => $siswa
        ], $count > 0 ? 200 : 404);
    }
    public function izin(Request $request)
    {   
        $wali = Auth::id();
        $izin = Izin::where('created_by', $wali)->with(['createdBy', 'targetSiswa'])
            ->paginate(10, ['*'], 'page', $request->query('page', 1));
        return Inertia::render('walisiswa/izin', [
            'prop' => $izin
        ]);
    }
    public function create_izin(Request $request, WaliSiswa $walisiswa)
    {
        $validated = $request->validate(
            [
                'message' => 'required|string|max:500',
                'target_siswa_id' => 'required|int',
                'created_by' => 'required|int',
                'tanggal_pulang' => 'required|date',
                'tanggal_kembali' => 'required|date'
            ]
        );
        Izin::create($validated);
        return redirect(route('walisiswa.izin'));
    }
}
