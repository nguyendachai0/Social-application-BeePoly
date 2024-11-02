// AvatarUploader.js
import React from "react";
import { FaUser, FaCamera } from "react-icons/fa";

const AvatarUploader = ({ avatar, onAvatarChange }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-purple-500">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <FaUser className="text-4xl text-gray-400" />
            </div>
          )}
        </div>
        <label
          htmlFor="avatar"
          className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors duration-300"
        >
          <FaCamera className="text-white text-xl" />
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={onAvatarChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default AvatarUploader;
