<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Broadcast_output extends Model
{
    use HasFactory;
    protected $fillable = [
        'broadcast_number',
        'template',
        'message'
    ];
}
