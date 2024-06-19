<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BroadcastTable extends Model
{
    use HasFactory;

    protected $table = 'broadcast_tbl';

    // Define the primary key if it's not 'id'
    protected $primaryKey = 'id';

    public $timestamps = false;

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
        'group_table_length',
    ];

    // Assuming 'id' is auto-incremented and not listed in fillable
    // 'created_at' and 'updated_at' are managed by Eloquent by default
}
