<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Broadcast_trial extends Model
{
    use HasFactory;
    protected $table = '_broadcast_trials';

    protected $fillable = [
        'username',
        'template_id',
        'message',
        'broadcast_name',
        'broadcast_number',
        'schedule_date',
        'schedule_time',
        'contacts',
        'created_at',
        'status',
        'success_full_per',
        'media1',
        'media2',
        'media3',
        'media4',
        'media5',
        'media6',
        'media7',
        'media8',
        'broadcast_message',
        'lineCount',
        'group_table_length'
    ];
}
