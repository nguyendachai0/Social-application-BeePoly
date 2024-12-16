import UserAvatar from "@/Components/UI/client/UserAvatar";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from "react";
import { FiEdit, FiTrash2, FiMail, FiSearch, FiX, FiCheck, FiPause } from "react-icons/fi";
import MessageModal from "@/Components/UI/client/MessageModal";
const AdminUserManagement = ({users, dataUsersPerPage}) => {

  const [currentUsers, setCurrentUsers] = useState(users.data || []); 
      const [selectedUsers, setSelectedUsers] = useState([]);
      const [showMessageModal, setShowMessageModal] = useState(false);
      const [currentUser, setCurrentUser] = useState(null);
      const [searchQuery, setSearchQuery] = useState("");
      const [currentPage, setCurrentPage] = useState(users.current_page);
      const [usersPerPage, setUsersPerPage] = useState(dataUsersPerPage);
      const start = (currentPage - 1) * usersPerPage + 1;
      const end = Math.min(currentPage * usersPerPage, users.total);
      const totalPages = Math.ceil(users.total / usersPerPage);  

      const handlePerPageChange = (event) => {
        const newPerPage = event.target.value;
        setUsersPerPage(newPerPage);
    
        router.visit('/admin/users', {
          method: 'get',
          data: { per_page: newPerPage }
        });
      };

      const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage((prevPage) => prevPage + 1);

          router.visit('/admin/users', {
            method: 'get',
            data: { page: currentPage + 1, per_page: usersPerPage }
          });
        }
      };

      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);

          router.visit('/admin/users', {
            method: 'get',
            data: { page: currentPage - 1, per_page: usersPerPage }
          });
        }
      };
        
      const handleUserSelect = (userId) => {
        setSelectedUsers((prev) =>
          prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
        );
      };
    
      const handleSelectAll = (e) => {
        if (e.target.checked) {
          const allUserIdsOnCurrentPage = users.data.map((user) => user.id);
          console.log('all',allUserIdsOnCurrentPage);
          setSelectedUsers(allUserIdsOnCurrentPage);
        } else {
          setSelectedUsers([]);
        }
      };

      const handleSetActive = () => {
        if (selectedUsers.length === 0) return;
    
        router.visit('/admin/users/set-active', {
          method: 'post',
          data: { user_ids: selectedUsers },
          onSuccess: () => {
            console.log('Users have been set as active');
          },
          onError: () => {
            console.error('There was an error updating the user statuses');
          }
        });
      };

      const handleSetInactive = () => {
        if (selectedUsers.length === 0) return;
      
        router.visit('/admin/users/set-inactive', {
          method: 'post',
          data: { user_ids: selectedUsers },
          onSuccess: () => {
            console.log('Users have been set as inactive');
          },
          onError: () => {
            console.error('There was an error updating the user statuses');
          }
        });
      };

      

      const handleSendMessage = (messageForm) => {

        const userIdsToSend = currentUser ? [currentUser.id] : selectedUsers; 
        if (!userIdsToSend.length) {
          alert("Please select at least one user to send a message.");
          return;
        }

        router.visit('/admin/users/send-message', {
          method: 'post',
          data: {
            user_ids: userIdsToSend,
            subject: messageForm.subject,
            message: messageForm.message
          },
          onSuccess: () => {
            alert("Message sent successfully");
            setShowMessageModal(false);
          },
          onError: (errors) => {
            alert("There was an error sending the message");
            console.error(errors);
          }
        });
      };

      const isAllSelected = users.data.every((user) => selectedUsers.includes(user.id));
      
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
            onChange={handlePerPageChange}
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
                checked={isAllSelected}                 
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
                  onClick={handleSetInactive}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
                >
                  <FiTrash2 />
                  <span>Set Selected as Inactive</span>
                </button>

                <button
              onClick={handleSetActive} // Set as Active
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
            >
              <FiCheck /> {/* Represents active */}
              <span>Set Selected as Active</span>
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
            {currentUsers.map((user) => (
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
                    <UserAvatar user={user} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.sur_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100">
                  {user.roles}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {user.active == 1 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.created_at}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setCurrentUser(user);
                        setShowMessageModal(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      <FiMail className="w-5 h-5" />
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
            Showing {start} to {end} of {users.total} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= Math.ceil(users.total / usersPerPage)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      

      {showMessageModal && (
        <MessageModal
        onClose={() => setShowMessageModal(false)}
        onSendMessage={handleSendMessage}
        selectedUsers={selectedUsers}
      />
      )}
    </div>

    );
}
AdminUserManagement.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
  );
export default AdminUserManagement;