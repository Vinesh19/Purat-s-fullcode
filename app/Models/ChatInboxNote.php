<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatInboxNote extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'receiver_id',
        'note',
    ];

    /**
     * Get the user that owns the chat inbox note.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
