<?php
namespace App\Http\Resources;
use Illuminate\Http\Resources\Json\JsonResource;
class ActivityResource extends JsonResource {
    public function toArray($request) {
        $data = parent::toArray($request);
        unset($data['solution_code']);
        return $data;
    }
}
