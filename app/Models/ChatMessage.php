<?php

namespace App\Models;

use App\Models\ChatInboxNote;
use App\Models\ChatInboxTag;
use App\Models\ChatMessageRoom;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'media',
        'type',
        'eventtype',
        'whts_ref_id'
        // 'room_id'
    ];

    public $timestamps = true; // Ensure timestamps are handled automatically

    public function chatRoom()
    {
        return $this->hasOne(ChatMessageRoom::class, 'receiver_id', 'receiver_id');
        // ->whereColumn('sender_id', 'sender_id');
    }
    public function notes()
    {
        return $this->hasMany(ChatInboxNote::class, 'receiver_id', 'receiver_id');
        // ->whereColumn('sender_id', 'sender_id');
    }
    public function tags()
    {
        return $this->hasMany(ChatInboxTag::class, 'receiver_id', 'receiver_id');
        // ->whereColumn('sender_id', 'sender_id');
    }
}
