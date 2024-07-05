<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MobNo3TemplateController extends Controller
{
    public function getFilteredData(Request $request)
    {
        $attributeValue = $request->input('attribute_value');
        $contain = $request->input('contain');
        $value = $request->input('value');

        $operator = $contain === '=' ? '=' : '!=';

        $data = MobNo3::where($attributeValue, $operator, $value)
            ->with(['template:id,template_body'])
            ->get(['receiver', 'schedule_date', 'schedule_time', 'template_id'])
            ->map(function ($item) {
                return [
                    'receiver_id' => $item->receiver,
                    'template_body' => $item->template->template_body ?? null,
                    'scheduled_date' => $item->schedule_date,
                    'scheduled_time' => $item->schedule_time,
                ];
            });

        return response()->json($data);
    }
}
