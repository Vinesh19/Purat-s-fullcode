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
        'username', 'template_name', 'reason', 'category', 'new_category',
        'language', 'header_area_type', 'header_text', 'header_media_type',
        'header_media_set', 'template_body', 'template_footer', 'button_type_set',
        'call_action_type_set1', 'call_action_type_set2', 'call_phone_btn_text',
        'call_phone_btn_phone_number', 'visit_website_btn_text', 'visit_website_url_set',
        'visit_website_url_text', 'quick_reply_btn_text1', 'quick_reply_btn_text2',
        'quick_reply_btn_text3', 'status', 'template_id'
    ];
    public $timestamps = true;

    // Optionally define relationships or other methods here
    public function language()
    {
        return $this->belongsTo(Language::class, 'language', 'id');
    }
}
