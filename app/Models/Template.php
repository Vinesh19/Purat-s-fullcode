<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    // Specify the table name if it differs from the default 'templates'
    protected $table = 'templates';

    // Define the primary key if it's not 'id'
    protected $primaryKey = 'id';

    // Specify which attributes are mass assignable
    protected $fillable = [
        'username',
        'template_name',
        'reason',
        // Add more attributes as needed
    ];

    // Optionally define relationships or other methods here
}
