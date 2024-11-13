<?php

namespace App\Http\Controllers;

use App\Jobs\BroadcastLikeCounts;
use App\Models\Comment;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Post;
use App\Models\Reaction;
use App\Models\Share;
use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ReactionController extends Controller
{
    /**
     * Store a reaction (like, comment, share, etc.).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'postID' => 'nullable|exists:posts,id',
            'storyID' => 'nullable|exists:stories,id',
            'commentID' => 'nullable|exists:comments,id',
            'shareID' => 'nullable|exists:shares,id',
            'messageID' => 'nullable|exists:messages,id',
        ]);

        [$type, $typeId] = $this->getReactionType($validated);

        if (!$type || !$typeId) {
            return response()->json(['message' => 'No valid reaction target provided'], 400);
        }

        $reaction = Reaction::create([
            'user_id' => Auth::id(),
            $type => $typeId,
        ]);

        $userIdToNotify = null;

        switch ($type) {
            case 'post_id':
                $post = Post::find($typeId);
                $userIdToNotify = $post->user_id;
                break;

            case 'story_id':
                $story = Story::find($typeId);
                $userIdToNotify = $story->user_id; // Story owner
                break;

            case 'comment_id':
                $comment = Comment::find($typeId);
                $userIdToNotify = $comment->user_id; // Comment owner
                break;

            case 'share_id':
                $share = Share::find($typeId);
                $userIdToNotify = $share->user_id; // Share owner
                break;

            case 'message_id':
                $message = Message::find($typeId);
                $userIdToNotify = $message->user_id; // Message owner
                break;
        }

        if ($userIdToNotify) {
            Notification::create([
                'user_id' => $userIdToNotify,
                'reaction_id' => $reaction->id,
                'status' => 'new',
            ]);
        }

        $likeCount = Reaction::where($type, $typeId)->count();

        return response()->json([
            'message' => 'Reaction added successfully',
            'reaction' => $reaction,
            'likeCount' => $likeCount,
        ]);
    }

    /**
     * Remove a reaction (like, comment, share, etc.).
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'postID' => 'nullable|exists:posts,id',
            'storyID' => 'nullable|exists:stories,id',
            'commentID' => 'nullable|exists:comments,id',
            'shareID' => 'nullable|exists:shares,id',
            'messageID' => 'nullable|exists:messages,id',
        ]);

        [$type, $typeId] = $this->getReactionType($validated);

        if (!$type || !$typeId) {
            return response()->json(['message' => 'No valid reaction target provided'], 400);
        }

        $reaction = Reaction::where('user_id', Auth::id())
            ->where($type, $typeId)
            ->first();

        if (!$reaction) {
            return response()->json(['message' => 'Reaction not found'], 404);
        }

        $reaction->delete();

        $likeCount = Reaction::where($type, $typeId)->count();

        return response()->json([
            'message' => 'Reaction removed successfully',
            'likeCount' => $likeCount
        ]);
    }

    public function fetchReactions($type, $id)
    {
        $reactions = Reaction::where("{$type}_id", $id)
            ->with('user')
            ->get();

        return response()->json($reactions);
    }

    public function hasReacted(Request $request)
    {
        $validated = $request->validate([
            'post_id' => 'nullable|exists:posts,id',
            'story_id' => 'nullable|exists:stories,id',
            'comment_id' => 'nullable|exists:comments,id',
            'share_id' => 'nullable|exists:shares,id',
            'message_id' => 'nullable|exists:messages,id',
        ]);

        $reaction = Reaction::where('user_id', Auth::id())
            ->where(function ($query) use ($validated) {
                $query->where('post_id', $validated['post_id'] ?? null)
                    ->orWhere('story_id', $validated['story_id'] ?? null)
                    ->orWhere('comment_id', $validated['comment_id'] ?? null)
                    ->orWhere('share_id', $validated['share_id'] ?? null)
                    ->orWhere('message_id', $validated['message_id'] ?? null);
            })
            ->exists();

        return response()->json(['has_reacted' => $reaction]);
    }

    private function getReactionType(array $validated): array
    {
        if (!empty($validated['postID'])) {
            return ['post_id', $validated['postID']];
        } elseif (!empty($validated['storyID'])) {
            return ['story_id', $validated['storyID']];
        } elseif (!empty($validated['commentID'])) {
            return ['comment_id', $validated['commentID']];
        } elseif (!empty($validated['shareID'])) {
            return ['share_id', $validated['shareID']];
        } elseif (!empty($validated['messageID'])) {
            return ['message_id', $validated['messageID']];
        }

        return [null, null];
    }
}
