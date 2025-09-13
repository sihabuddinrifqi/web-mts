<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CsrfController extends Controller
{
    /**
     * Get fresh CSRF token
     */
    public function getToken(Request $request)
    {
        // Regenerate CSRF token
        $request->session()->regenerateToken();
        
        return response()->json([
            'csrf_token' => csrf_token(),
        ]);
    }
}
