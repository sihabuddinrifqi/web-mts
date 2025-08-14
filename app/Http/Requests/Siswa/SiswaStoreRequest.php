<?php
// app/Http/Requests/SiswaStoreRequest.php

namespace App\Http\Requests\Siswa;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SiswaStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'name' => 'required|string|max:255',
            
            // Siswa-specific fields
            'nik' => 'required|numeric|digits:16|unique:users,nik',
            'alamat' => 'required|string|max:500',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'angkatan' => 'required|digits:4|integer|min:1900|max:' . (date('Y') + 1),
            'jenis_kelamin' => ['required', Rule::in(['pria', 'wanita'])],
            'siswa_role' => ['required', Rule::in(['regular', 'pengurus'])],
            'guru_id' => 'required|exists:users,id,role,guru',
            'ortu_id' => 'required|exists:users,id,role,walisiswa',
        ];
    }

    public function messages()
    {
        return [
            'guru_id.exists' => 'The selected guru is invalid.',
            'ortu_id.exists' => 'The selected walisiswa is invalid.',
            'nik.digits' => 'NIK must be exactly 16 digits.',
        ];
    }
}