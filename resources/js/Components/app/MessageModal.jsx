import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

const MessageModal = React.memo(({ onClose, onSendMessage, selectedUsers }) => {
  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: ""
  });
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, []);

  const handleSendMessage = () => {
    if (!messageForm.subject || !messageForm.message) {
      alert("Subject and message are required.");
      return;
    }
    onSendMessage(messageForm); 
    setMessageForm({ subject: "", message: "" }); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Send Message</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              value={messageForm.subject}
              onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              ref={messageInputRef}
              value={messageForm.message}
              onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
              className="w-full p-2 border rounded h-32"
              placeholder="Type your message here..."
            />
            <p className="text-sm text-gray-500 mt-1">
              {messageForm.message.length}/500 characters
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
});

export default MessageModal;
