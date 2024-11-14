<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminContentManagementController extends Controller
{
    public function index()
    {
        return inertia('AdminContentManagement');
    }
}
