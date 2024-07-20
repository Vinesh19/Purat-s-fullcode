<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MobNo3 extends Model
{
    use HasFactory;
    protected $table = 'mob_no3';
    protected $fillable = [
        'receiver',
        'media1',
        'media2',
        'media3',
        'media4',
        'media5',
        'media6',
        'media7',
        'media8',
        'media9',
        'username',
        'template_id',
        // 'template_id2',
        'name',
        'status',
        'delivery_date',
        'delivery_time',
        'dat',
        'tim',
        'request_id',
    ];
    // public function template()
    // {
    //     return $this->belongsTo(Template::class, 'template_id', 'template_name');
    // }
    public function template()
    {
        return $this->belongsTo(Template::class, 'template_id2', 'id');
    }
}
