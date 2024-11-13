<?php

namespace App\Http\Controllers;

use App\Events\CommentPosted;
use App\Models\Attachment;
use App\Models\Comment;
use App\Models\Notification;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class CommentController extends Controller
{
    public function getCommentsForPost(Post $post)
    {
        $comments = $post->comments()
            ->whereNull('parent_comment_id')
            ->with([
                'user',
                'replies.user',
                'replies.replies.user',
                'attachments'
            ])
            ->get();

        foreach ($comments as $comment) {
            $this->loadRepliesRecursively($comment);
            $comment->reply_count = $comment->countReplies();
        }

        return response()->json($comments);
    }

    public function postComment(Request $request, Post $post)
    {
        $validatedData = $request->validate([
            'comment' => 'required|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        Log::info(['Validated Data:', $validatedData]);

        $attachments = [];

        DB::beginTransaction();

        try {
            $comment = $post->comments()->create([
                'comment' => $request->comment,
                'user_id' => auth()->id(),
                'post_id' => $post->id,
            ]);

            if ($request->has('attachments')) {
                $files  = $request->attachments;
                foreach ($files as $file) {
                    $directory = 'attachments/comments/' . Str::random(32);
                    Storage::makeDirectory($directory);

                    $path = $file->store($directory, 'public');
                    $attachment = Attachment::create([
                        'comment_id' => $comment->id,
                        'name' => $file->getClientOriginalName(),
                        'mime' => $file->getClientMimeType(),
                        'size' => $file->getSize(),
                        'path' => $path,
                    ]);

                    $attachments[] = $attachment;
                }
                $comment->attachments = $attachments;
            }

            Notification::create([
                'user_id' => $post->user_id,
                'comment_id' => $comment->id,
                'status' => 'new',
            ]);

            event(new CommentPosted($comment, $post->user_id));

            DB::commit();

            return response()->json($comment->load('user'), 201);
        } catch (\Exception $e) {

            DB::rollBack();

            Log::error('Error posting comment: ' . $e->getMessage());

            return response()->json(['error' => 'Something went wrong'], 500);
        }
    }

    public function replyToComment(Request $request, $commentId)
    {
        $request->validate([
            'reply' => 'required|min:1',
        ]);

        $parentComment = Comment::findOrFail($commentId);

        $reply = $parentComment->replies()->create([
            'comment' => $request->input('reply'),
            'user_id' => auth()->id(),
            'post_id' => $parentComment->post_id,
            'parent_comment_id' => $parentComment->id,
        ]);

        return response()->json($reply->load('user'));
    }

    public function loadRepliesRecursively($comment)
    {
        $comment->load(['replies.user', 'replies.replies.user']);

        foreach ($comment->replies as $reply) {
            $this->loadRepliesRecursively($reply);
        }
    }
}
