<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\MobNo3;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
// use Illuminate\Support\Facades\DB;


class GraphController extends Controller
{

    public function getCountByTimeFrame(Request $request)
    {
        // Define validation rules
        $rules = [
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d|after_or_equal:start_date',
        ];

        // Create a validator instance
        $validator = Validator::make($request->all(), $rules);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $startDate = Carbon::parse($request->input('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->input('end_date'))->endOfDay();

            $data = [];
            $totalCount = 0;

            // Fetch counts per day
            for ($date = $startDate; $date->lte($endDate); $date->addDay()) {
                $count = MobNo3::whereDate('created_at', $date)->count();
                $data[$date->format('Y-m-d')] = $count;
                $totalCount += $count;
            }

            // Prepare response
            if ($totalCount === 0) {
                return response()->json(['message' => 'No mobile numbers found for the specified criteria.'], 404);
            } else {
                $data['Total Count'] = $totalCount;
                return response()->json($data);
            }
        } catch (\Exception $e) {
            // Return the exception message
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
