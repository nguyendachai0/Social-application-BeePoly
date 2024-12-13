<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'report_type' => 'required|string',
            'details' => 'nullable|string',
            'reported_user_id' => 'nullable|exists:users,id',
            'reported_post_id' => 'nullable|exists:posts,id',
            'reported_comment_id' => 'nullable|exists:comments,id',
            'status' => 'nullable|string|in:pending,resolved,ignored',
        ]);

        $validated['reporting_user_id'] = auth()->id();

        $report = Report::create($validated);

        return  back();
    }
}
