<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory;

    protected $table = 'chat_messages'; // Define the table name

    protected $fillable = [
        'username',
        'sender_id',
        'receiver_id',
        'status',
        'agent',
        'previous_agent',
        'first_message',
        'eventDescription',
        'replySourceMessage',
        'text',
        'type',
        'eventtype',
        'whts_ref_id'
    ];

    public $timestamps = true; // Ensure timestamps are handled automatically

}
