import { useState } from "react";

const ReplyForm = ({ commentId }) => {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply: replyText }),
      });

      if (response.ok) {
        setReplyText(""); // Clear reply input
      } else {
        console.error("Failed to submit reply");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 pl-4">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write a reply..."
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 resize-none"
        rows="2"
      />
      <button
        onClick={handleReplySubmit}
        disabled={isSubmitting}
        className="px-3 py-1 mt-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? "Posting..." : "Post Reply"}
      </button>
    </div>
  );
};

export default ReplyForm;
