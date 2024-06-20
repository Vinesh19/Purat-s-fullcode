<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mob_no3_trial extends Model
{
    use HasFactory;

    protected $table = '_mob_no3_trials';

    protected $fillable = [
        'receiver',
        'whatsappid',
        'senderid',
        'senderpwd',
        'name',
        'username',
        'reseller',
        'masterreseller',
        'status',
        'dat',
        'tim',
        'credits',
        'request_id',
        'delivery_time',
        'delivery_date',
        'template_id',
        'message',
        'schedule_date',
        'schedule_time',
        'success_full_per',
        'media1',
        'media2',
        'media3',
        'media4',
        'media5',
        'media6',
        'media7',
        'media8',
        'media9',
        'media10',
        'media11',
        'media12',
        'media13',
        'base64',
        'button1_value',
        'button2_value',
        'button3_value',
        'call_title',
        'call_number',
        'url_title',
        'url_value',
        'text'
    ];
}
