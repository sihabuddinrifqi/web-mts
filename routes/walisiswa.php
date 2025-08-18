<?php

use App\Http\Controllers\WalisiswaController;
use Illuminate\Support\Facades\Route;

Route::prefix('/wali')
    ->middleware(['auth'])
    ->name('wali.')
    ->group(function () {
        Route::get('/anak', [WalisiswaController::class, 'index'])
            ->name('anak'); // wali.anak

        // --- Route Grup untuk Izin ---
        Route::get('/izin', [WalisiswaController::class, 'izin'])
            ->name('izin'); // wali.izin (Menampilkan daftar semua izin)

        Route::get('/izin/create', [WalisiswaController::class, 'create_izin_form'])
             ->name('izin.create'); // wali.izin.create (Menampilkan form)
             
        Route::post('/izin', [WalisiswaController::class, 'store_izin'])
             ->name('izin.store'); // wali.izin.store (Menyimpan data baru)

        // BARU: Route untuk menampilkan detail satu izin
        Route::get('/izin/{izin}', [WalisiswaController::class, 'show_izin'])
             ->name('izin.show'); // wali.izin.show 

        // BARU: Route untuk menghapus satu izin
        Route::delete('/izin/{izin}', [WalisiswaController::class, 'destroy_izin'])
               ->name('izin.destroy'); // wali.izin.destroy
    });