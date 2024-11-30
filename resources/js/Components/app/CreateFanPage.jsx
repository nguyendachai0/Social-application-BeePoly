import React, {useRef } from 'react';
import { router } from '@inertiajs/react';
import {  FaCamera,  FaTimes,  FaImage} from "react-icons/fa";
const CreateFanPage = ({ newFanPage, setNewFanPage, onSubmit, onClose }) => {
    const coverInputRef = useRef(null);
    const avatarInputRef = useRef(null);
  
    const handleImageChange = (e, type) => {
      const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setNewFanPage({ ...newFanPage, [type]: file, [`${type}Preview`]: previewUrl });
      }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
      
        const formData = new FormData();
        formData.append("name", newFanPage.name);
        formData.append("description", newFanPage.description);
        if (newFanPage.cover) {
          formData.append("cover_image", newFanPage.cover);
        }
        if (newFanPage.avatar) {
          formData.append("avatar", newFanPage.avatar);
        }
      
        router.post("/fanpages", formData, {
          onSuccess: () => {
            console.log("Fan page created successfully!");
            onClose(); // Close the modal or handle success UI
          },
          onError: (errors) => {
            console.error(errors); // Display errors (Inertia will pass back validation errors)
          },
        });
      };
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
  
          <h3 className="text-2xl font-bold mb-6">Create Fan Page</h3>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div
                className="h-48 rounded-lg bg-gray-100 mb-4 overflow-hidden"
                onClick={() => coverInputRef.current.click()}
              >
                {newFanPage.coverPreview ? (
                  <img
                    src={newFanPage.coverPreview}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaImage className="text-4xl text-gray-400" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={coverInputRef}
                onChange={(e) => handleImageChange(e, "cover")}
                accept="image/*"
                className="hidden"
              />
  
              <div className="absolute -bottom-6 left-4">
                <div
                  className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white overflow-hidden"
                  onClick={() => avatarInputRef.current.click()}
                >
                  {newFanPage.avatarPreview ? (
                    <img
                      src={newFanPage.avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FaCamera className="text-2xl text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={(e) => handleImageChange(e, "avatar")}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
  
            <div className="mt-8 space-y-4">
              <div>
                <input
                  type="text"
                  value={newFanPage.name}
                  onChange={(e) => setNewFanPage({ ...newFanPage, name: e.target.value })}
                  placeholder="Page Name"
                  className="w-full p-3 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
  
              <div>
                <textarea
                  value={newFanPage.description}
                  onChange={(e) => setNewFanPage({ ...newFanPage, description: e.target.value })}
                  placeholder="Page Description"
                  className="w-full p-3 border border-purple-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="3"
                  required
                />
              </div>
            </div>
  
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:opacity-90"
              >
                Create Page
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
export default CreateFanPage;