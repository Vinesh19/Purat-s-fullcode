<?php

namespace App\Http\Controllers;

use App\Models\MobNo3;
use App\Models\Template;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use App\Models\CampaignDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BroadcastController extends Controller
{
    public function store(Request $request)
    {
        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'name1' => 'nullable',
            'template_name1' => 'required',
            'template_id2' => 'required',
            'textbox' => 'required|string|regex:/^[0-9\s\n]+$/', // Validation for numbers, spaces, and new lines only
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            // Extract request data
            $username = $request->input('username');
            $name1 = $request->input('name1'); // sender_id
            $template_name1 = $request->input('template_name1');
            $template_id2 = $request->input('template_id2');
            $delivery_date = $request->input('delivery_date');
            $delivery_time = $request->input('delivery_time');

            $media1 = $request->file('media_file');
            $media_file_Path = $media1 ? $media1->store('media', 'public') : null;
            // $media1 = $request->input('media_file');

            $media2 = $request->input('attribute1');
            $media3 = $request->input('attribute2');
            $media4 = $request->input('attribute3');
            $media5 = $request->input('attribute4');
            $media6 = $request->input('attribute5');
            $media7 = $request->input('attribute6');
            $media8 = $request->input('attribute7');
            $media9 = $request->input('attribute8');
            $media10 = $request->input('attribute9');
            $media11 = $request->input('attribute10');
            $media12 = $request->input('attribute11');
            $media13 = $request->input('attribute12');

            $reseller = $request->reseller;
            $status_campaign = $request->status;
            $queue_no = $request->queue_no;

            // $template_id2 = Template::where('username', $username)->get('id');

            // Extract mobile numbers from Textbox (split by new line)
            $mobileNumbers = preg_split('/\r\n|\r|\n/', $request->input('textbox'));
            $numbers_counts = count($mobileNumbers); // Count the total number of mobile numbers for the campaign details

            // Generate request_id
            $request_id = rand(10000000, 99999999);

            // Prepare data for batch insert
            $data = [];

            foreach ($mobileNumbers as $receiver) {
                $receiver = trim($receiver); // Trim any whitespace
                if (!empty($receiver)) {
                    $data[] = [
                        'receiver' => $receiver,
                        'media1' => $media_file_Path,
                        // 'media1' => $media1,
                        'media2' => $media2,
                        'media3' => $media3,
                        'media4' => $media4,
                        'media5' => $media5,
                        'media6' => $media6,
                        'media7' => $media7,
                        'media8' => $media8,
                        'media9' => $media9,
                        'media10' => $media10,
                        'media11' => $media11,
                        'media12' => $media12,
                        'media13' => $media13,
                        'username' => $username,
                        'template_id' => $template_name1,
                        'template_id2' => $template_id2,
                        'name' => $name1,
                        'status' => 'PP1',
                        'delivery_date' => $delivery_date,
                        'delivery_time' => $delivery_time,
                        'dat' => now()->format('d M Y'),
                        'tim' => now()->format('H:i'),
                        'request_id' => $request_id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }

            // Start transaction
            DB::beginTransaction();

            // Chunk and batch insert into mob_no3
            $chunkSize = 1000; // Adjust the chunk size as needed
            foreach (array_chunk($data, $chunkSize) as $chunk) {
                MobNo3::insert($chunk);
            }

            // Insert data into campaign_details_trials
            CampaignDetail::create([
                'username' => $username,
                'senderid' => $name1,
                'request_id' => $request_id,
                'Reseller' => $reseller,
                'dat' => $delivery_date,
                'estimated_time' => $delivery_time,
                'date' => $delivery_date,
                'status' => $status_campaign,
                'numbers' => $numbers_counts,
                'queue_no' => $queue_no,
            ]);

            // Commit transaction
            DB::commit();

            return response()->json(['message' => 'Data inserted successfully'], 200);
        } catch (\Exception $e) {
            // Rollback transaction on exception
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
