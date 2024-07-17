<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessageRoom extends Model
{
    use HasFactory;

    protected $table = 'chat_messages_room'; // Define the table name

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'status',
        'is_starred',
        'is_read',
        // 'username'
    ];


}
