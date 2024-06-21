<?php

namespace App\Http\Controllers;

use App\Models\CampaignDetail;
use App\Models\MobNo3;
use Illuminate\Http\Request;
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
            'textbox' => 'string', // Added validation for the textbox field
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
            $delivery_date = $request->input('delivery_date');
            $delivery_time = $request->input('delivery_time');

            // Check if a media file is uploaded
            $media1 = $request->file('media_file');
            if ($media1) {
                // Store the file in the 'public/media' directory
                $media_file_Path = $media1->store('media', 'public');
            } else {
                // Skip processing if no media file is uploaded
                $media_file_Path = null; // or handle as needed
            }

            // Extract other attributes from the request
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

            $reseller = $request->resreller;
            $status_campaign = $request->status;
            $queue_no = $request->queue_no;

            // Extract mobile numbers from textbox and split them into an array
            $mobileNumbers = explode(',', $request->input('textbox'));
            $numbers_counts = count($mobileNumbers); // Count the total number of mobile numbers

            // Generate a unique request ID
            $request_id = rand(10000000, 99999999);

            // Start a database transaction
            DB::beginTransaction();

            // Insert each mobile number along with media and other details
            foreach ($mobileNumbers as $receiver) {
                $receiver = trim($receiver); // Trim any whitespace
                if (!empty($receiver)) {
                    MobNo3::create([
                        'receiver' => $receiver,
                        'media1' => $media_file_Path,
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
                        'name' => $name1,
                        'status' => 'PP1',
                        'delivery_date' => $delivery_date,
                        'delivery_time' => $delivery_time,
                        // 'dat' => now()->format('d M Y'),
                        'dat' => now(),
                        // 'tim' => now(),
                        'tim' => now()->format('H:i'),
                        'request_id' => $request_id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // Insert campaign details
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

            // Commit the transaction
            DB::commit();

            return response()->json(['message' => 'Data inserted successfully'], 200);
        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
