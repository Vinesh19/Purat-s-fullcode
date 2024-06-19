<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;
use Laravel\Passport\HasApiTokens;
use App\Models\Broadcast_output;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;


    // Specify the table name if it differs from the default 'templates'
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
        'obile_no',
        'email_otp',
        'email_otp_verified_at'
        // 'broadcast_id'
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
    public function broadcast_output()
    {
        return $this->hasOne(Broadcast_output::class);
    }
}
