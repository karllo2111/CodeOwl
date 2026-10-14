<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class RunCodeRequest extends FormRequest {
    public function authorize() { return true; }
    public function rules() { return ['code' => 'required|string|max:50000', 'language' => 'nullable|string|in:javascript,typescript']; }
}
