import {  useState } from "react";
import {  usePage, router } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";

const CreateGroupChat = ({ setShowCreateGroupModal }) => {

    const [groupName, setGroupName] = useState("");
    const friends =  usePage().props.friends;
    const [selectedFriends, setSelectedFriends] = useState([]);

    const handleFriendSelection = (friendId) => {
        setSelectedFriends(prev => {
            if (prev.includes(friendId)) {
            return prev.filter(id => id !== friendId);
            }
            return [...prev, friendId];
        });
        };
    
        const handleCreateGroup = () => {
        if (groupName && selectedFriends.length >= 2) {
            router.post("/groups",{
                name: groupName,
                members: selectedFriends,
            }, {
                onSuccess: () => {
                  setShowCreateGroupModal(false);
                  setGroupName("");
                  setSelectedFriends([]);
                },
                onError: (errors) => {
                  console.log(errors);
                }
              });
        }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
        
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter group name"
                />
              </div>
        
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Friends (minimum 2)
                </label>
                <div className="max-h-60 overflow-y-auto">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => handleFriendSelection(friend.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFriends.includes(friend.id)}
                        onChange={() => {}}
                        className="mr-3"
                      />
                      <UserAvatar user={friend} />
                      <span className="ml-3">{friend.first_name} {friend.sur_name}</span>
                    </div>
                  ))}
                </div>
              </div>
        
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName || selectedFriends.length < 2}
                  className={`px-4 py-2 rounded-lg ${
                    groupName && selectedFriends.length >= 2
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )
}

export default CreateGroupChat;