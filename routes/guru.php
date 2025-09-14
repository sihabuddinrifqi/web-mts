<?php

use App\Http\Controllers\NilaiController;
use App\Http\Controllers\GuruController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\PresensiViewController;
use App\Http\Controllers\NilaiViewController;

Route::prefix('/guru')
    ->name('guru.')
    ->middleware(['auth'])
    ->group(
        function(){
            Route::get('/siswa-didik', [GuruController::class, 'siswa'])->name('siswa');
            Route::get('/pelajaran', [GuruController::class, 'pelajaran'])->name('pelajaran');
            Route::get('/izin', [GuruController::class, 'izin'])->name('izin');
            Route::patch('/nilai/{nilai}', [NilaiController::class, 'update'])->name('nilai.update');
            Route::post('/nilai', [NilaiController::class, 'store'])->name('nilai.store');
            Route::patch('/presensi/{presensi}', [PresensiController::class, 'update'])->name('presensi.update');
            
            // Presensi routes
            Route::get('/presensi', [PresensiViewController::class, 'guru'])->name('presensi.index');
            Route::get('/presensi/statistics', [PresensiViewController::class, 'statistics'])->name('presensi.statistics');
            Route::get('/presensi/modal-data', [PresensiViewController::class, 'modalData'])->name('presensi.modal-data');
            
            // Nilai routes
            Route::get('/nilai', [NilaiViewController::class, 'guru'])->name('nilai.index');
            Route::get('/nilai/statistics', [NilaiViewController::class, 'statistics'])->name('nilai.statistics');
        }
    );
