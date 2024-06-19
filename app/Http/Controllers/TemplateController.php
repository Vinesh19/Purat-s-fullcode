<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Template;

class TemplateController extends Controller
{
    public function show($template_id)
    {
        // Find the template by template_id
        $template = Template::where('id', $template_id)->first();

        if (!$template) {
            return response()->json([
                'status' => 0,
                'message' => 'Template not found'
            ], 404);
        }

        // Return the template data with a success status
        return response()->json([
            'status' => 1,
            'template' => $template
        ]);
    }
}
