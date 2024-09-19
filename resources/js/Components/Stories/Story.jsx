import React, { useState } from "react";

// Stories Slider Component
const Stories = () => {
    const [stories, setStories] = useState([
        { id: 1, img: "https://via.placeholder.com/150", name: "John" },
        { id: 2, img: "https://via.placeholder.com/150", name: "Jane" },
        { id: 3, img: "https://via.placeholder.com/150", name: "Alice" },
        { id: 4, img: "https://via.placeholder.com/150", name: "Alice" },
        { id: 5, img: "https://via.placeholder.com/150", name: "Alice" },


    ]);
    const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
    const [newStoryContent, setNewStoryContent] = useState("");

    // Open Modal for creating story
    const openCreateStoryModal = () => {
        setShowCreateStoryModal(true);
    };

    // Close Modal
    const closeCreateStoryModal = () => {
        setShowCreateStoryModal(false);
        setNewStoryContent("");
    };

    // Handle story creation
    const handleCreateStory = (e) => {
        e.preventDefault();
        // Add new story to the list (for demo purposes, we'll add a new object)
        setStories([
            ...stories,
            { id: stories.length + 1, img: "https://via.placeholder.com/150", name: "New Story" },
        ]);
        // Close modal after creation
        closeCreateStoryModal();
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex space-x-4 overflow-x-auto">
                {/* Create Story Button */}
                <div
                    className="relative w-24 h-40 bg-gray-100 flex flex-col items-center justify-center rounded-lg cursor-pointer hover:opacity-90"
                    onClick={openCreateStoryModal}
                >
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        +
                    </div>
                    <p className="mt-2 text-sm text-center">Create Story</p>
                </div>

                {/* Display existing stories */}
                {stories.map((story) => (
                    <div key={story.id} className="relative w-24 h-40">
                        <img
                            src={story.img}
                            alt={story.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <p className="absolute bottom-2 left-2 text-white font-bold text-sm">
                            {story.name}
                        </p>
                    </div>
                ))}
            </div>

            {/* Create Story Modal */}
            {showCreateStoryModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-4">Create Story</h2>
                        <form onSubmit={handleCreateStory}>
                            <textarea
                                className="w-full h-32 p-2 border rounded-lg"
                                placeholder="Write your story..."
                                value={newStoryContent}
                                onChange={(e) => setNewStoryContent(e.target.value)}
                            ></textarea>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 bg-gray-300 px-4 py-2 rounded-lg"
                                    onClick={closeCreateStoryModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Post Story
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stories;
