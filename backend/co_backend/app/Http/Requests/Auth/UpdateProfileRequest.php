<?php
namespace App\Http\Requests\Auth;
use Illuminate\Foundation\Http\FormRequest;
class UpdateProfileRequest extends FormRequest {
    public function authorize() { return true; }
    public function rules() { return ['name' => 'nullable|string', 'username' => 'nullable|string|unique:users,username,'.$this->user()->id, 'bio' => 'nullable|string|max:1000', 'avatar' => 'nullable|string']; }
}
