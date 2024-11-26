<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    // Method to handle group creation
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'members' => 'required|array|min:2',
            'members.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        $group = new Group();
        $group->name = $request->name;
        $group->owner_id = $user->id;
        $group->save();

        $group->users()->attach($request->members);

        $group->users()->attach($user->id);

        return response()->json([
            'message' => 'Group created successfully!',
            'group' => $group,
        ], 201);
    }
}
