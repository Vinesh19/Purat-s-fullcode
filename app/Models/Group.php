<?php

namespace App\Models;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Group extends Model
{
    use HasFactory;

    protected $table = 'groups';

    protected $fillable = [
        'user_id',
        'Group_name',
        'added_by'
    ];

    public function contacts()
    {
        return $this->hasMany(Contact::class, 'Contact_group_id', 'id');
    }
}
