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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'tanggal_pulang' => 'required|date',
            'tanggal_kembali' => 'required|date',
            'created_by' => 'required|integer',
            'target_siswa_id' => 'required|integer',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $photoName = time() . '_' . $photo->getClientOriginalName();
            $photo->move(public_path('uploads/izin'), $photoName);
            $validated['photo'] = 'uploads/izin/' . $photoName;
        }

        Izin::create($validated);

        return redirect()->route('admin.izin.index');
    }



    public function update(Request $request, Izin $izin)
    {
        Gate::authorize('update', $izin);
        $validated = $request->validate([
            'status' => ['required', Rule::in(['accepted', 'rejected'])]
        ]);
        $izin->update($validated);
        return response()->json(
            [
                'message' => "successfully updated izin " . $izin->id,
                'received' => 1,
                'data' => $izin
            ]
        );
    }

    public function destroy(Izin $izin)
    {
        $izin->delete();
        return redirect()->route('admin.izin.index');
    }
}
