<?php

use App\Http\Controllers\NilaiController;
use App\Http\Controllers\PelajaranController;
use App\Http\Controllers\PelajaranManagerController;
use App\Http\Controllers\SiswaManagerController;
use App\Http\Controllers\GuruManagerController;
use App\Http\Controllers\WalisiswaController;
use App\Http\Controllers\WaliSiswaManagerController;
use App\Http\Controllers\PresensiController;
use App\Models\Izin;
use App\Models\Pelajaran;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\WaliSiswa;
use Illuminate\Support\Facades\Route;

Route::prefix('/api')
    ->name('api.')
    ->middleware(['auth'])
    ->group(function () {

        // === API List Data ===
        Route::get('/guru', [GuruManagerController::class, 'api'])->name('guru');
        Route::get('/walisiswa', [WalisiswaManagerController::class, 'api'])->name('walisiswa');
        Route::get('/siswa', [SiswaManagerController::class, 'api'])->name('siswa');
        Route::get('/siswa/{angkatan}', [SiswaManagerController::class, 'angkatan'])->name('siswa.angkatan');
        Route::get('/pelajaran', [PelajaranManagerController::class, 'api'])->name('pelajaran');

        // === Nilai & Presensi ===
        Route::get('/nilai/siswa/{siswa}', [NilaiController::class, 'APIsiswa'])->name('nilai.siswa');

        Route::post('/guru/presensi', [PresensiController::class, 'storeApi'])
                        ->name('guru.presensi.store');
        Route::get('/presensi/siswa/{siswa}', [PresensiController::class, 'getPresensiSiswa'])
            ->name('presensi.siswa');

        // === Relasi detail ===
        Route::prefix('/detail')
            ->name('detail.')
            ->group(function () {

                Route::get('/siswa/{siswa}', function (Siswa $siswa) {
                    return response()->json([
                        'message' => 'successfully received detail siswa',
                        'received' => 1,
                        'data' => $siswa->load('ortu', 'guru', 'nilai')
                    ]);
                })->name('siswa');

                Route::get('/walisiswa/{walisiswa}', function (WaliSiswa $walisiswa) {
                    return response()->json([
                        'message' => 'successfully received detail walisiswa',
                        'received' => 1,
                        'data' => $walisiswa->load(['anak'])
                    ]);
                })->name('walisiswa');

                Route::get('/guru/{guru}', function (Guru $guru) {
                    return response()->json([
                        'message' => 'successfully reveived detail guru',
                        'received' => 1,
                        'data' => $guru->load('anak', 'pelajaran')
                    ]);
                })->name('guru');

                Route::get('/izin/{izin}', function (Izin $izin) {
                    return response()->json([
                        'message' => 'successfully received detail izin',
                        'received' => 1,
                        'data' => $izin
                    ]);
                })->name('izin');

                Route::get('/pelajaran/{pelajaran}', function (Pelajaran $pelajaran) {
                    return response()->json([
                        'message' => 'successfully received detail pelajaran',
                        'received' => 1,
                        'data' => $pelajaran->load(['pengampu', 'nilai'])
                    ]);
                })->name('pelajaran');

                Route::get('/pelajaran/{pelajaran}/nilai', [PelajaranController::class, 'APINilai'])
                    ->name('pelajaran.nilai');

                Route::get('/pelajaran/{pelajaran}/presensi/{tanggal}', [PelajaranController::class, 'APIPresensi'])
                    ->name('pelajaran.presensi');
             Route::get('/detail/pelajaran/{pelajaran}/siswa', [PresensiController::class, 'siswaByPelajaran']);
            Route::post('/detail/pelajaran/{pelajaran}/presensi', [PresensiController::class, 'storeByPelajaran']);
            
            });
            
    });
