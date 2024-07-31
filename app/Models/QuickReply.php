<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuickReply extends Model
{
    use HasFactory;

    protected $table = 'quick_replies';

    protected $fillable = [
        'heading',
        'description',
        'media',
        'username'
    ];
}

