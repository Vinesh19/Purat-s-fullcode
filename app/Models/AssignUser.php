<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignUser extends Model
{
    use HasFactory;

    protected $table = 'assign_users'; // Explicitly specifying the table name

    protected $fillable = [
        'username', 'assign_user', 'agent_email', 'agent_mobile', 'roll', 'online_status', 'is_mobile_verified', 'is_email_verified', 'team', 'last_login_at', 'last_login_IP'
    ];
}
