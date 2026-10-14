<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;
class RegisterRequest extends FormRequest {
    public function authorize() { return true; }
    public function rules() { return ['name' => 'required|string|max:255', 'email' => 'required|email|unique:users', 'username' => 'nullable|string|unique:users', 'password' => 'required|confirmed|min:8']; }
}
