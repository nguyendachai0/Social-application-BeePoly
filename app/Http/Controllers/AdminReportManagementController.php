<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Inertia\Inertia;

class AdminReportManagementController extends Controller
{
    public function index()
    {
        $reports = Report::all();
        return Inertia::render('AdminAdminReportManagement', ['reports' =>  $reports]);
    }
}
