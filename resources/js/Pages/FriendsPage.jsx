import React, { useState } from "react";
import { FiSearch, FiCheck, FiX, FiUserPlus } from "react-icons/fi";
import { BiErrorCircle } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";
import Layout from "@/Layouts/Layout";
import UserAvatar from "@/Components/app/UserAvatar";
import { router } from '@inertiajs/react';
import { toast } from "react-toastify";


const FriendsPage = ({initialFriends, initialFriendRequests}) => {
  const [friendRequests, setFriendRequests] = useState(initialFriendRequests);
  const [friends, setFriends] = useState(initialFriends);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const filteredFriends = friends.filter((friend) =>
    `${friend.first_name} ${friend.sur_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const acceptFriendRequest = (senderId) => {
    router.post("/accept-friend-request", { senderId }, {
      onSuccess: (page) => {
        toast.success("Friend request accepted successfully!", {
            position: "top-right",
            autoClose: 3000, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        setFriends(page.props.initialFriends);
        setFriendRequests(page.props.initialFriendRequests);
      },
      onError: (errors) => {
        console.error(errors.message || "An error occurred.");
      },
      preserveScroll: true,
    });
  };

  const declineFriendRequest = (senderId) => {
    router.post("/decline-friend-request", { senderId }, {
      onSuccess: (page) => {
        toast.success("Friend request declined successfully!", {
            position: "top-right",
            autoClose: 3000, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        setFriendRequests(page.props.initialFriendRequests);
      },
      onError: (errors) => {
        console.error(errors.message || "An error occurred.");
      },
      preserveScroll: true,
    });
  };

  return (
    <div className="col-span-9 min-h-screen  mt-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl shadow-md flex items-center transform hover:scale-102 transition-all duration-300" role="alert">
            <BiErrorCircle className="mr-2 text-xl" />
            {error}
          </div>
        )}

        <section className="mb-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100" aria-labelledby="friend-requests-heading">
          <h2 id="friend-requests-heading" className="text-3xl font-bold mb-6 flex items-center text-gray-800">
            <FiUserPlus className="mr-3 text-blue-500" /> Friend Requests
          </h2>
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center">
                  <UserAvatar user={request.sender}/>
                  <span className="ml-4 font-semibold text-gray-700 text-lg">{request.sender.first_name} {request.sender.sur_name}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => acceptFriendRequest(request.sender.id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                    aria-label={`Accept friend request from ${request.sender.first_name} ${request.sender.sur_name}`}
                  >
                    <FiCheck className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => declineFriendRequest(request.sender.id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                    aria-label={`Reject friend request from ${request.sender.first_name} ${request.sender.sur_name}`}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {friendRequests.length === 0 && (
              <p className="text-gray-500 text-center py-6 text-lg">No pending friend requests</p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100" aria-labelledby="friends-list-heading">
          <h2 id="friends-list-heading" className="text-3xl font-bold mb-6 flex items-center text-gray-800">
            <FaUserFriends className="mr-3 text-blue-500" /> Friends
          </h2>
          <div className="mb-6 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300 bg-gray-50 hover:bg-gray-100"
              aria-label="Search friends"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
               <UserAvatar user={friend} />
                <span className="ml-4 font-semibold text-gray-700 text-lg">{friend.first_name} {friend.sur_name}</span>
              </div>
            ))}
          </div>
          {filteredFriends.length === 0 && (
            <p className="text-gray-500 text-center py-6 text-lg">No friends found</p>
          )}
        </section>
      </div>
    </div>
  );
};

FriendsPage.layout = (page) => (
    <Layout showRightBar={false} showLeftBar={true}>{page}</Layout>
  );

export default FriendsPage;