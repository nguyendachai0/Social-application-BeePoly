const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <FaTrash className="mx-auto text-red-500 text-4xl mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Post</h3>
          <p className="text-gray-500 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

export default  DeleteConfirmationModal;