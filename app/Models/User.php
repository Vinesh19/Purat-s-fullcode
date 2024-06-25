<?php

namespace App\Models;
use App\Models\Group;

use App\Models\Broadcast_output;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    // Specify the table name if it differs from the default
    protected $table = 'ci_admin';

    // Define the primary key if it's not 'id'
    protected $primaryKey = 'admin_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'username',
        'password',
        'mobile_no',
        'email_otp',
        'email_otp_verified_at',
        'otp'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the broadcast output record associated with the user.
     */
    // public function broadcast_output()
    // {
    //     return $this->hasOne(Broadcast_output::class);
    // }

}
