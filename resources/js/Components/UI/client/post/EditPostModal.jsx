import Attachment from "../attachments/Attachment";
import { useState } from "react";
import { FaTimes, FaUserTag } from "react-icons/fa";
import UserAvatar from "../UserAvatar";


const EditPostModal = ({
  setShowEditModal,
  handleFileChange,
  handleUpdatePost,
  editPost,
  editCaption,
  removeImage,
  setEditCaption,
  editImages,
  taggedFriends,
  friendsList,
  showFriendsList,
  setShowFriendsList,
  tagFriend,
  removeTag,
  visibilityOptions,
  setEditPost
}) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md  max-h-[90vh] w-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Edit Post</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2">
            {visibilityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setEditPost(prev => ({ ...prev, visibility: option.value }))}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${editPost.visibility === option.value ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}
              >
                <option.icon className="text-lg" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={editCaption}
          onChange={(e) => setEditCaption(e.target.value)}
          className="w-full p-2 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Image
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* {editImages && editImages.length > 0 && (
         <Attachment attachments={editImages} />
        )} */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {taggedFriends.map(friend => (
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

        <div className="mt-4 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
          {editImages.map((media, index) => (
            <div key={index} className="relative">
              {media.mime.startsWith("image/") ? (
                <img
                  src={media.path}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={media.path}
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                />
              )}
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleUpdatePost}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4"
        >
          Update Post
        </button>
      </div>
    </div>
  );
}
export default EditPostModal;