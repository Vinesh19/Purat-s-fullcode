<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign_detail_trial extends Model
{
    use HasFactory;

    protected $table = '_campaign_details_trials';

    protected $fillable = [
        'username',
        'senderid',
        'request_id',
        'Reseller',
        'dat',
        'estimated_time',
        'date',
        'status',
        'numbers',
        'queue_no'
    ];
}
