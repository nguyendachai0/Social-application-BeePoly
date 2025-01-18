import React from "react";
import { FaImage, FaTimes, FaUserTag, FaVideo } from "react-icons/fa";
import UserAvatar from "../UserAvatar";

const CreatePostModal = ({
  isEditing = false,
  newPost,
  setNewPost,
  mediaPreview,
  removeMedia,
  showFriendsList,
  setShowFriendsList,
  friendsList,
  tagFriend,
  removeTag,
  handleMediaUpload,
  setShowCreatePost,
  handleSubmitPost,
  handleCaptionChange,
  visibilityOptions
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white p-2">
        <h2 className="text-2xl font-bold">Create Post</h2>
        <button
          onClick={() => setShowCreatePost(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2">
          {visibilityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setNewPost(prev => ({ ...prev, visibility: option.value }))}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${newPost.visibility === option.value ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
            >
              <option.icon className="text-lg" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={newPost.caption}
        onChange={handleCaptionChange}
        placeholder="What's on your mind?"
        className="w-full p-4 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {newPost.taggedFriends.map(friend => (
            <div key={friend.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <UserAvatar user={friend} size="small" />
              <span className="ml-1">{friend.first_name} {friend.sur_name}</span>
              <button
                onClick={() => removeTag(friend.id)}
                className="ml-2 text-gray-500 hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowFriendsList(!showFriendsList)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <FaUserTag className="mr-2" /> Tag Friends
        </button>

        {showFriendsList && (
          <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg">
            {friendsList.map(friend => (
              <div
                key={friend.id}
                onClick={() => tagFriend(friend)}
                className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
              >
                <UserAvatar user={friend} size="small" />
                <span className="ml-2">{friend.first_name} {friend.sur_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {mediaPreview.map((media, index) => (
          <div key={index} className="relative">
            {media.type === "image" ? (
              <img
                src={media.url}
                alt={`Preview ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <video
                src={media.url}
                className="w-full h-48 object-cover rounded-lg"
                controls
              />
            )}
            <button
              onClick={() => removeMedia(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center sticky bottom-0 bg-white p-2">
        <div className="flex space-x-4">
          <label className="cursor-pointer text-gray-500 hover:text-blue-500">
            <FaImage className="text-xl" />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMediaUpload}
              className="hidden"
            />
          </label>
          <label className="cursor-pointer text-gray-500 hover:text-blue-500">
            <FaVideo className="text-xl" />
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleMediaUpload}
              className="hidden"
            />
          </label>
        </div>
        <button
          onClick={handleSubmitPost}
          disabled={!newPost.caption && mediaPreview.length === 0}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isEditing ? "Save Changes" : "Post"}
        </button>
      </div>
    </div>
  </div>
);

export default CreatePostModal;
