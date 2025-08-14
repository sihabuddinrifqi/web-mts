<?php

namespace App\Http\Requests\Guru;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GuruStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'name' => 'required|string|max:255',
            
            'jenis_kelamin' => ['required', Rule::in(['pria', 'wanita'])],
        ];
    }
    public function messages()
    {
        return [
            'phone.exists' => 'The inserted phone is already exist.',
        ];
    }
}
