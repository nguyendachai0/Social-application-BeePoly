<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fanpage;
use App\Services\Posts\PostServiceInterface;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class FanpageController extends Controller
{
    public $postService;
    public function __construct(PostServiceInterface $postService)
    {
        $this->postService = $postService;
    }
    public function show($id)
    {
        $fanpage = FanPage::findOrFail($id);
        $isOwner = Auth::id() === $fanpage->user_id ? true  : false;
        $posts = $this->postService->getPostsForFanpage($id);
        $isFollowed = $fanpage->followers()->where('user_id', auth()->id())->exists();

        return Inertia::render('FanpageView', [
            'fanpage' => $fanpage,
            'initialPosts' => $posts,
            'isOwner' => $isOwner,
            'is_followed' => $isFollowed,
        ]);
    }


    /**
     * Store a newly created fanpage in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $coverImagePath = $this->uploadFile($request->file('cover_image'), 'fanpage_covers');
        $avatarPath = $this->uploadFile($request->file('avatar'), 'fanpage_avatars');

        $fanpage = Fanpage::create([
            'user_id' => Auth::id(),
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'cover_image' => $coverImagePath,
            'avatar' => $avatarPath,
        ]);

        return back();
    }

    public function uploadAvatarOrCoverImage(Request $request, $fanpageId, $type)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'fanpage_id' => 'required|exists:fanpages,id',
        ]);

        $fanpage = Fanpage::find($fanpageId);

        $path = $this->uploadFile($request->file('file'), $type . 's');

        if ($fanpage->$type && Storage::disk('public')->exists($fanpage->$type)) {
            Storage::disk('public')->delete($fanpage->$type);
        }

        $fanpage->$type = $path;
        $fanpage->save();

        return redirect()->back()->with('success', 'Uploaded ' . $type . ' successfully');
    }

    private function uploadFile($file, $directory)
    {
        if (!$file) {
            return null;
        }

        $filename = uniqid() . '.' . $file->getClientOriginalExtension();

        return $file->storeAs($directory, $filename, 'public');
    }
}
