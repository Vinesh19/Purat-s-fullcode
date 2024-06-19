<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Broadcast_input extends Model
{
    use HasFactory;

    protected $fillable = [
        'attribute',
        'date',
        'time',
        'csv_file',
        'media'
    ];

}