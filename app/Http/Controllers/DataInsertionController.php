<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Broadcast_trial;
use App\Models\Mob_no3_trial;
use App\Models\Campaign_detail_trial;
use Illuminate\Support\Facades\Validator;

class DataInsertionController extends Controller
{
    public function store(Request $request)
    {
        // Define the validation rules based on the fields of all three tables
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255',
            'template_id' => 'required|integer',
            'message' => 'nullable|string',
            'broadcast_name' => 'nullable|string',
            'broadcast_number' => 'nullable|string',
            'schedule_date' => 'nullable|date',
            'schedule_time' => 'nullable|date_format:H:i:s',
            'contacts' => 'nullable|string',
            'created_at' => 'nullable|date',
            'status' => 'nullable|integer',
            'success_full_per' => 'nullable|string|max:45',
            'media1' => 'nullable|string',
            'media2' => 'nullable|string',
            'media3' => 'nullable|string',
            'media4' => 'nullable|string',
            'media5' => 'nullable|string',
            'media6' => 'nullable|string',
            'media7' => 'nullable|string',
            'media8' => 'nullable|string',
            'broadcast_message' => 'nullable|string',
            'lineCount' => 'nullable|string|max:50',
            'group_table_length' => 'nullable|string|max:50',
            'receiver' => 'nullable|integer',
            'whatsappid' => 'nullable|string|max:500',
            'senderid' => 'nullable|string|max:500',
            'senderpwd' => 'nullable|string|max:100',
            'name' => 'nullable|string|max:50|collation:utf8mb4_unicode_ci',
            'reseller' => 'nullable|string|max:50',
            'masterreseller' => 'nullable|string|max:1000|collation:utf8mb4_unicode_ci',
            'dat' => 'nullable|string|max:30',
            'tim' => 'nullable|string|max:30',
            'credits' => 'nullable|string|max:10',
            'request_id' => 'nullable|string|max:30',
            'delivery_time' => 'nullable|string|max:30',
            'delivery_date' => 'nullable|string',
            'base64' => 'nullable|string',
            'button1_value' => 'nullable|string|max:100',
            'button2_value' => 'nullable|string|max:100',
            'button3_value' => 'nullable|string|max:100',
            'call_title' => 'nullable|string|max:100',
            'call_number' => 'nullable|string|max:100',
            'url_title' => 'nullable|string|max:100',
            'url_value' => 'nullable|string|max:100',
            'text' => 'nullable|string|max:1100',
            'Reseller' => 'nullable|string|max:200',
            'estimated_time' => 'nullable|string|max:200',
            'date' => 'nullable|string|max:100',
            'numbers' => 'nullable|string|max:200',
            'queue_no' => 'nullable|string|max:200',
            'file' => 'nullable|mimes:csv,txt'
        ]);

        // Handle validation failure
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Assign input data to variables
        $username = $request->input('username');
        $template_id = $request->input('template_id');
        $message = $request->input('message');
        $broadcast_name = $request->input('broadcast_name');
        $broadcast_number = $request->input('broadcast_number');
        $schedule_date = $request->input('schedule_date');
        $schedule_time = $request->input('schedule_time');
        $contacts = $request->input('contacts');
        $created_at = $request->input('created_at');
        $status = $request->input('status');
        $success_full_per = $request->input('success_full_per');
        $media1 = $request->input('media1');
        $media2 = $request->input('media2');
        $media3 = $request->input('media3');
        $media4 = $request->input('media4');
        $media5 = $request->input('media5');
        $media6 = $request->input('media6');
        $media7 = $request->input('media7');
        $media8 = $request->input('media8');
        $broadcast_message = $request->input('broadcast_message');
        $lineCount = $request->input('lineCount');
        $group_table_length = $request->input('group_table_length');
        $receiver = $request->input('receiver');
        $whatsappid = $request->input('whatsappid');
        $senderid = $request->input('senderid');
        $senderpwd = $request->input('senderpwd');
        $name = $request->input('name');
        $reseller = $request->input('reseller');
        $masterreseller = $request->input('masterreseller');
        $dat = $request->input('dat');
        $tim = $request->input('tim');
        $credits = $request->input('credits');
        // $request_id = $request->input('request_id');
        $request_id = rand(111111, 999999);
        $delivery_time = $request->input('delivery_time');
        $delivery_date = $request->input('delivery_date');
        $base64 = $request->input('base64');
        $button1_value = $request->input('button1_value');
        $button2_value = $request->input('button2_value');
        $button3_value = $request->input('button3_value');
        $call_title = $request->input('call_title');
        $call_number = $request->input('call_number');
        $url_title = $request->input('url_title');
        $url_value = $request->input('url_value');
        $text = $request->input('text');
        $reseller_campaign = $request->input('Reseller');
        $estimated_time = $request->input('estimated_time');
        $date_campaign = $request->input('date');
        $numbers = $request->input('numbers');
        $queue_no = $request->input('queue_no');
        $status_campaign = $request->input('status');
        $campaign_date = $request->input('date');

        // Insert data into broadcBroadcast_trialast_trials
        // Broadcast_trial::create([
        //     'username' => $username,
        //     'template_id' => $template_id,
        //     'message' => $message,
        //     'broadcast_name' => $broadcast_name,
        //     'broadcast_number' => $broadcast_number,
        //     'schedule_date' => $schedule_date,
        //     'schedule_time' => $schedule_time,
        //     'contacts' => $contacts,
        //     'created_at' => $created_at,
        //     'status' => $status,
        //     'success_full_per' => $success_full_per,
        //     'media1' => $media1,
        //     'media2' => $media2,
        //     'media3' => $media3,
        //     'media4' => $media4,
        //     'media5' => $media5,
        //     'media6' => $media6,
        //     'media7' => $media7,
        //     'media8' => $media8,
        //     'broadcast_message' => $broadcast_message,
        //     'lineCount' => $lineCount,
        //     'group_table_length' => $group_table_length
        // ]);

        // Insert data into mob_no3_trials
        if ($request->hasFile('file')) {
            $path = $request->file('file')->getRealPath();
            $data = array_map('str_getcsv', file($path));

            foreach ($data as $index => $row) {
                Mob_no3_trial::create([
                    // 'receiver' => $row[0] ?? $receiver,
                    'whatsappid' => $whatsappid,
                    'senderid' => $senderid,
                    'senderpwd' => $senderpwd,
                    'name' => $name,
                    'username' => $username,
                    'reseller' => $reseller,
                    'masterreseller' => $masterreseller,
                    'status' => $status,
                    'dat' => $dat,
                    'tim' => $tim,
                    'credits' => $credits,
                    'request_id' => $request_id,
                    'delivery_time' => $delivery_time,
                    'delivery_date' => $delivery_date,
                    'template_id' => $template_id,
                    'message' => $message,
                    'schedule_date' => $schedule_date,
                    'schedule_time' => $schedule_time,
                    'success_full_per' => $success_full_per,
                    'media1' => $row[1] ?? $media1,
                    'media2' => $row[2] ?? $media2,
                    'media3' => $row[3] ?? $media3,
                    'media4' => $row[4] ?? $media4,
                    'media5' => $row[5] ?? $media5,
                    'media6' => $row[6] ?? $media6,
                    'media7' => $row[7] ?? $media7,
                    'media8' => $row[8] ?? $media8,
                    'media9' => $row[9] ?? null,
                    'media10' => $row[10] ?? null,
                    'media11' => $row[11] ?? null,
                    'media12' => $row[12] ?? null,
                    'media13' => $row[13] ?? null,
                    'base64' => $base64,
                    'button1_value' => $button1_value,
                    'button2_value' => $button2_value,
                    'button3_value' => $button3_value,
                    'call_title' => $call_title,
                    'call_number' => $call_number,
                    'url_title' => $url_title,
                    'url_value' => $url_value,
                    'text' => $text,
                ]);
            }
        } else {
            Mob_no3_trial::create([
                'receiver' => $receiver,
                'whatsappid' => $whatsappid,
                'senderid' => $senderid,
                'senderpwd' => $senderpwd,
                'name' => $name,
                'username' => $username,
                'reseller' => $reseller,
                'masterreseller' => $masterreseller,
                'status' => $status,
                'dat' => $dat,
                'tim' => $tim,
                'credits' => $credits,
                'request_id' => $request_id,
                'delivery_time' => $delivery_time,
                'delivery_date' => $delivery_date,
                'template_id' => $template_id,
                'message' => $message,
                'schedule_date' => $schedule_date,
                'schedule_time' => $schedule_time,
                'success_full_per' => $success_full_per,
                'base64' => $base64,
                'button1_value' => $button1_value,
                'button2_value' => $button2_value,
                'button3_value' => $button3_value,
                'call_title' => $call_title,
                'call_number' => $call_number,
                'url_title' => $url_title,
                'url_value' => $url_value,
                'text' => $text,
            ]);
        }

        // Insert data into campaign_details_trials
        Campaign_detail_trial::create([
            'username' => $username,
            'senderid' => $senderid,
            'request_id' => $request_id,
            'Reseller' => $reseller_campaign,
            'dat' => $dat,
            'estimated_time' => $estimated_time,
            'date' => $campaign_date,
            'status' => $status_campaign,
            'numbers' => $numbers,
            'queue_no' => $queue_no,
        ]);

        return response()->json(['message' => 'Data inserted successfully'], 201);
    }



    // public function store(Request $request)
    // {
    //     // Define the validation rules based on the fields of all three tables
    //     $validator = Validator::make($request->all(), [
    //         'username' => 'required|string|max:255',
    //         'template_id' => 'required|integer',
    //         'message' => 'nullable|string',
    //         'broadcast_name' => 'nullable|string',
    //         'broadcast_number' => 'nullable|string',
    //         'schedule_date' => 'nullable|date',
    //         'schedule_time' => 'nullable|date_format:H:i:s',
    //         'contacts' => 'nullable|string',
    //         'created_at' => 'nullable|date',
    //         'status' => 'nullable|integer',
    //         'success_full_per' => 'nullable|string|max:45',
    //         'media1' => 'nullable|string',
    //         'media2' => 'nullable|string',
    //         'media3' => 'nullable|string',
    //         'media4' => 'nullable|string',
    //         'media5' => 'nullable|string',
    //         'media6' => 'nullable|string',
    //         'media7' => 'nullable|string',
    //         'media8' => 'nullable|string',
    //         'broadcast_message' => 'nullable|string',
    //         'lineCount' => 'nullable|string|max:50',
    //         'group_table_length' => 'nullable|string|max:50',
    //         'receiver' => 'nullable|integer',
    //         'whatsappid' => 'nullable|string|max:500',
    //         'senderid' => 'nullable|string|max:500',
    //         'senderpwd' => 'nullable|string|max:100',
    //         'name' => 'nullable|string|max:50|collation:utf8mb4_unicode_ci',
    //         'reseller' => 'nullable|string|max:50',
    //         'masterreseller' => 'nullable|string|max:1000|collation:utf8mb4_unicode_ci',
    //         'dat' => 'nullable|string|max:30',
    //         'tim' => 'nullable|string|max:30',
    //         'credits' => 'nullable|string|max:10',
    //         'request_id' => 'nullable|string|max:30',
    //         'delivery_time' => 'nullable|string|max:30',
    //         'delivery_date' => 'nullable|string',
    //         'base64' => 'nullable|string',
    //         'button1_value' => 'nullable|string|max:100',
    //         'button2_value' => 'nullable|string|max:100',
    //         'button3_value' => 'nullable|string|max:100',
    //         'call_title' => 'nullable|string|max:100',
    //         'call_number' => 'nullable|string|max:100',
    //         'url_title' => 'nullable|string|max:100',
    //         'url_value' => 'nullable|string|max:100',
    //         'text' => 'nullable|string|max:1100',
    //         'Reseller' => 'nullable|string|max:200',
    //         'estimated_time' => 'nullable|string|max:200',
    //         'date' => 'nullable|string|max:100',
    //         'numbers' => 'nullable|string|max:200',
    //         'queue_no' => 'nullable|string|max:200',
    //         'file' => 'nullable|mimes:csv,txt'
    //     ]);

    //     // Handle validation failure
    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     // Assign input data to variables
    //     $username = $request->input('username');
    //     $template_id = $request->input('template_id');
    //     $message = $request->input('message');
    //     $broadcast_name = $request->input('broadcast_name');
    //     $broadcast_number = $request->input('broadcast_number');
    //     $schedule_date = $request->input('schedule_date');
    //     $schedule_time = $request->input('schedule_time');
    //     $contacts = $request->input('contacts');
    //     $created_at = $request->input('created_at');
    //     $status = $request->input('status');
    //     $success_full_per = $request->input('success_full_per');
    //     $media1 = $request->input('media1');
    //     $media2 = $request->input('media2');
    //     $media3 = $request->input('media3');
    //     $media4 = $request->input('media4');
    //     $media5 = $request->input('media5');
    //     $media6 = $request->input('media6');
    //     $media7 = $request->input('media7');
    //     $media8 = $request->input('media8');
    //     $broadcast_message = $request->input('broadcast_message');
    //     $lineCount = $request->input('lineCount');
    //     $group_table_length = $request->input('group_table_length');
    //     $receiver = $request->input('receiver');
    //     $whatsappid = $request->input('whatsappid');
    //     $senderid = $request->input('senderid');
    //     $senderpwd = $request->input('senderpwd');
    //     $name = $request->input('name');
    //     $reseller = $request->input('reseller');
    //     $masterreseller = $request->input('masterreseller');
    //     $dat = $request->input('dat');
    //     $tim = $request->input('tim');
    //     $credits = $request->input('credits');
    //     // $request_id = $request->input('request_id');
    //     $request_id = rand(111111,999999);
    //     $delivery_time = $request->input('delivery_time');
    //     $delivery_date = $request->input('delivery_date');
    //     $base64 = $request->input('base64');
    //     $button1_value = $request->input('button1_value');
    //     $button2_value = $request->input('button2_value');
    //     $button3_value = $request->input('button3_value');
    //     $call_title = $request->input('call_title');
    //     $call_number = $request->input('call_number');
    //     $url_title = $request->input('url_title');
    //     $url_value = $request->input('url_value');
    //     $text = $request->input('text');
    //     $reseller_campaign = $request->input('Reseller');
    //     $estimated_time = $request->input('estimated_time');
    //     $date_campaign = $request->input('date');
    //     $numbers = $request->input('numbers');
    //     $queue_no = $request->input('queue_no');
    //     $status_campaign = $request->input('status');
    //     $campaign_date = $request->input('date');

    //     // Insert data into broadcBroadcast_trialast_trials
    //     Broadcast_trial::create([
    //         'username' => $username,
    //         'template_id' => $template_id,
    //         'message' => $message,
    //         'broadcast_name' => $broadcast_name,
    //         'broadcast_number' => $broadcast_number,
    //         'schedule_date' => $schedule_date,
    //         'schedule_time' => $schedule_time,
    //         'contacts' => $contacts,
    //         'created_at' => $created_at,
    //         'status' => $status,
    //         'success_full_per' => $success_full_per,
    //         'media1' => $media1,
    //         'media2' => $media2,
    //         'media3' => $media3,
    //         'media4' => $media4,
    //         'media5' => $media5,
    //         'media6' => $media6,
    //         'media7' => $media7,
    //         'media8' => $media8,
    //         'broadcast_message' => $broadcast_message,
    //         'lineCount' => $lineCount,
    //         'group_table_length' => $group_table_length
    //     ]);

    //     // Insert data into mob_no3_trials
    //     if ($request->hasFile('file')) {
    //         $path = $request->file('file')->getRealPath();
    //         $data = array_map('str_getcsv', file($path));

    //         foreach ($data as $index => $row) {
    //             Mob_no3_trial::create([
    //                 'receiver' => $row[0] ?? $receiver,
    //                 'whatsappid' => $whatsappid,
    //                 'senderid' => $senderid,
    //                 'senderpwd' => $senderpwd,
    //                 'name' => $name,
    //                 'username' => $username,
    //                 'reseller' => $reseller,
    //                 'masterreseller' => $masterreseller,
    //                 'status' => $status,
    //                 'dat' => $dat,
    //                 'tim' => $tim,
    //                 'credits' => $credits,
    //                 'request_id' => $request_id,
    //                 'delivery_time' => $delivery_time,
    //                 'delivery_date' => $delivery_date,
    //                 'template_id' => $template_id,
    //                 'message' => $message,
    //                 'schedule_date' => $schedule_date,
    //                 'schedule_time' => $schedule_time,
    //                 'success_full_per' => $success_full_per,
    //                 'media1' => $row[1] ?? $media1,
    //                 'media2' => $row[2] ?? $media2,
    //                 'media3' => $row[3] ?? $media3,
    //                 'media4' => $row[4] ?? $media4,
    //                 'media5' => $row[5] ?? $media5,
    //                 'media6' => $row[6] ?? $media6,
    //                 'media7' => $row[7] ?? $media7,
    //                 'media8' => $row[8] ?? $media8,
    //                 'media9' => $row[9] ?? null,
    //                 'media10' => $row[10] ?? null,
    //                 'media11' => $row[11] ?? null,
    //                 'media12' => $row[12] ?? null,
    //                 'media13' => $row[13] ?? null,
    //                 'base64' => $base64,
    //                 'button1_value' => $button1_value,
    //                 'button2_value' => $button2_value,
    //                 'button3_value' => $button3_value,
    //                 'call_title' => $call_title,
    //                 'call_number' => $call_number,
    //                 'url_title' => $url_title,
    //                 'url_value' => $url_value,
    //                 'text' => $text,
    //             ]);
    //         }
    //     } else {
    //         Mob_no3_trial::create([
    //             'receiver' => $receiver,
    //             'whatsappid' => $whatsappid,
    //             'senderid' => $senderid,
    //             'senderpwd' => $senderpwd,
    //             'name' => $name,
    //             'username' => $username,
    //             'reseller' => $reseller,
    //             'masterreseller' => $masterreseller,
    //             'status' => $status,
    //             'dat' => $dat,
    //             'tim' => $tim,
    //             'credits' => $credits,
    //             'request_id' => $request_id,
    //             'delivery_time' => $delivery_time,
    //             'delivery_date' => $delivery_date,
    //             'template_id' => $template_id,
    //             'message' => $message,
    //             'schedule_date' => $schedule_date,
    //             'schedule_time' => $schedule_time,
    //             'success_full_per' => $success_full_per,
    //             'base64' => $base64,
    //             'button1_value' => $button1_value,
    //             'button2_value' => $button2_value,
    //             'button3_value' => $button3_value,
    //             'call_title' => $call_title,
    //             'call_number' => $call_number,
    //             'url_title' => $url_title,
    //             'url_value' => $url_value,
    //             'text' => $text,
    //         ]);
    //     }

    //     // Insert data into campaign_details_trials
    //     Campaign_detail_trial::create([
    //         'username' => $username,
    //         'senderid' => $senderid,
    //         'request_id' => $request_id,
    //         'Reseller' => $reseller_campaign,
    //         'dat' => $dat,
    //         'estimated_time' => $estimated_time,
    //         'date' => $campaign_date,
    //         'status' => $status_campaign,
    //         'numbers' => $numbers,
    //         'queue_no' => $queue_no,
    //     ]);

    //     return response()->json(['message' => 'Data inserted successfully'], 201);
    // }
}
