import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiMail, FiSearch, FiX, FiCheck, FiPause } from "react-icons/fi";
const AdminUserManagement = () => {

    const [users, setUsers] = useState([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "Admin",
          status: "Active",
          dateCreated: "2024-01-15",
          avatar: "images.unsplash.com/photo-1633332755192-727a05c4013d"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "User",
          status: "Inactive",
          dateCreated: "2024-01-16",
          avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330"
        }
      ]);
    
      const [selectedUsers, setSelectedUsers] = useState([]);
      const [showProfileModal, setShowProfileModal] = useState(false);
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [showMessageModal, setShowMessageModal] = useState(false);
      const [currentUser, setCurrentUser] = useState(null);
      const [searchQuery, setSearchQuery] = useState("");
      const [currentPage, setCurrentPage] = useState(1);
      const [usersPerPage, setUsersPerPage] = useState(10);
      const [activeTab, setActiveTab] = useState("personal");
      const [messageForm, setMessageForm] = useState({
        subject: "",
        message: ""
      });

    const UserProfileModal = ({ user, onClose }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">User Profile</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <FiX className="w-6 h-6" />
              </button>
            </div>
    
            <div className="mb-4">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`px-4 py-2 rounded ${activeTab === "personal" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                >
                  Personal Details
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`px-4 py-2 rounded ${activeTab === "account" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                >
                  Account Info
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`px-4 py-2 rounded ${activeTab === "activity" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                >
                  Activity History
                </button>
              </div>
    
              <div className="p-4 bg-gray-50 rounded">
                {activeTab === "personal" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={`https://${user.avatar}`}
                        alt={user.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={user.name}
                        className="p-2 border rounded"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={user.email}
                        className="p-2 border rounded"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                )}
    
                {activeTab === "account" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select className="w-full p-2 border rounded">
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select className="w-full p-2 border rounded">
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
    
                {activeTab === "activity" && (
                  <div className="space-y-4">
                    <div className="border rounded p-4">
                      <h4 className="font-medium">Recent Activity</h4>
                      <ul className="mt-2 space-y-2">
                        <li className="text-sm text-gray-600">Logged in - 2 hours ago</li>
                        <li className="text-sm text-gray-600">Profile updated - 1 day ago</li>
                        <li className="text-sm text-gray-600">Password changed - 5 days ago</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
    
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      );
    
      // Delete Confirmation Modal
      const DeleteConfirmationModal = ({ onClose, onConfirm }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete the selected user(s)? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    
      // Message Modal
      const MessageModal = ({ onClose }) => (
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
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Send Message
              </button>
            </div>
          </div>
        </div>
      );
    
      const handleUserSelect = (userId) => {
        setSelectedUsers((prev) =>
          prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
        );
      };
    
      const handleSelectAll = (e) => {
        setSelectedUsers(e.target.checked ? users.map((user) => user.id) : []);
      };
    return (
        <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={usersPerPage}
            onChange={(e) => setUsersPerPage(Number(e.target.value))}
            className="border rounded-lg px-4 py-2"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedUsers.length === users.length}
                onChange={handleSelectAll}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">
                {selectedUsers.length} selected
              </span>
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
                >
                  <FiTrash2 />
                  <span>Delete Selected</span>
                </button>
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  <FiMail />
                  <span>Message Selected</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserSelect(user.id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`https://${user.avatar}`}
                      alt={user.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.dateCreated}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentUser(user);
                        setShowProfileModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentUser(user);
                        setShowMessageModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <FiMail className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FiTrash2
                        onClick={() => {
                          setCurrentUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
              {Math.min(currentPage * usersPerPage, users.length)} of{" "}
              {users.length} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(users.length / usersPerPage))
                  )
                }
                disabled={currentPage >= Math.ceil(users.length / usersPerPage)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showProfileModal && currentUser && (
        <UserProfileModal
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {showMessageModal && (
        <MessageModal onClose={() => setShowMessageModal(false)} />
      )}
    </div>

    );
}
AdminUserManagement.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
  );
export default AdminUserManagement;