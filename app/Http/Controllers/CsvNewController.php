<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MobNo3; // Replace with your Eloquent model for mob_no3
use App\Models\User; // Replace with your Eloquent model for ci_admin
use App\Models\CampaignDetail; // Replace with your Eloquent model for campaign_details
use DateTime;
use Illuminate\Support\Facades\DB; // To use DB facade for transactions


class CsvNewController extends Controller
{
    public function importCsv(Request $request)
    {
        // return $request;
        // Validate the request
        $request->validate([
            'username' => 'required',
            'name1' => 'required', //name1 is for sender id which will be submitted in campaign_details
            'template_name1' => 'required',
            'csv_file' => 'required|mimes:csv,txt',
        ]);

        try {
            // Retrieve form data
            $username1 = $request->input('username');
            $name1 = $request->input('name1');
            $template_name1 = $request->input('template_name1');

            // Get the uploaded file
            $file = $request->file('csv_file');
            $filePath = $file->getPathname();

            // Open the CSV file for reading
            $file_handle = fopen($filePath, "r");

            // Initialize variables
            $total_rows = 0;
            $inserted_rows = 0;
            $missing_rows = [];

            // Begin transaction
            DB::beginTransaction();

            // Process CSV file
            // while (($data = fgetcsv($file_handle)) !== false) {
            $isHeader = true; // Flag to skip the header row
            while (($data = fgetcsv($file_handle)) !== false) {
                if ($isHeader) {
                    $isHeader = false;
                    continue; // Skip header row
                }
                $total_rows++;

                // Check for empty rows
                if (empty($data)) {
                    $missing_rows[] = $total_rows;
                    continue;
                }

                // Extract data from CSV row
                $receiver = $data[0];
                $media1 = isset($data[1]) ? $data[1] : null;
                $media2 = isset($data[2]) ? $data[2] : null;
                $media3 = isset($data[3]) ? $data[3] : null;
                $media4 = isset($data[4]) ? $data[4] : null;
                $media5 = isset($data[5]) ? $data[5] : null;
                $media6 = isset($data[6]) ? $data[6] : null;
                $media7 = isset($data[7]) ? $data[7] : null;
                $media8 = isset($data[8]) ? $data[8] : null;
                $media9 = isset($data[9]) ? $data[9] : null;

                // Insert data into database using Eloquent ORM
                $newRecord = new MobNo3();
                $newRecord->receiver = $receiver;
                $newRecord->media1 = $media1;
                $newRecord->media2 = $media2;
                $newRecord->media3 = $media3;
                $newRecord->media4 = $media4;
                $newRecord->media5 = $media5;
                $newRecord->media6 = $media6;
                $newRecord->media7 = $media7;
                $newRecord->media8 = $media8;
                $newRecord->media9 = $media9;
                $newRecord->username = $username1;
                $newRecord->template_id = $template_name1;
                $newRecord->name = $name1;
                $newRecord->status = 'PP1';
                $newRecord->delivery_date = date('Y-m-d');
                $newRecord->delivery_time = date('H:i:s');
                $newRecord->dat = date('d M Y');
                $newRecord->tim = date('H:i');
                $newRecord->request_id = rand(10000000, 99999999);
                $newRecord->save();

                $inserted_rows++;

                // Output progress if needed
            }

            // Commit transaction
            DB::commit();

            // Close file handle
            fclose($file_handle);

            // Update email credits
            // User::where('username', $username1)->decrement('email_credits', $inserted_rows);

            // Insert into campaign_details table
            CampaignDetail::create([
                'username' => $username1,
                'senderid' => $name1,
                'numbers' => $inserted_rows,
                'dat' => date('d M Y'),
                'date' => date('Y-m-d'),
                'request_id' => $newRecord->request_id,
                'queue_no' => $template_name1,
            ]);

            // Output summary
            echo "<p>Total rows processed: $total_rows</p>";
            echo "<p>Inserted rows: $inserted_rows</p>";
            echo "<p>Missing rows: " . implode(", ", $missing_rows) . "</p>";

            // Redirect to another page after a delay
            echo "<script>setTimeout(function(){ window.location.href = 'https://wa20.nuke.co.in/v5/broadcast/email_credits'; }, 6000);</script>";
        } catch (\Exception $e) {
            // Handle any exceptions
            DB::rollBack();
            echo "<p>An error occurred: " . $e->getMessage() . "</p>";
        }
    }
}
