<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatInboxTag extends Model
{
    use HasFactory;

    protected $table = 'chatinboxtag';

    protected $fillable = [
        'username',
        'receiver_id',
        'tag',
        'assign_user',
    ];
}
