import React, { useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { FiUsers, FiMessageSquare, FiSettings, FiUserPlus, FiActivity} from "react-icons/fi";
import { BsGlobe } from "react-icons/bs";
import { MdOutlineContentPaste } from "react-icons/md";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const dummyUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Moderator", status: "Inactive" },
  ];

  const dummyContent = [
    { id: 1, user: "John Doe", type: "Post", content: "Amazing sunset!", status: "Pending" },
    { id: 2, user: "Jane Smith", type: "Comment", content: "Great photo!", status: "Approved" },
    { id: 3, user: "Mike Johnson", type: "Post", content: "Check this out", status: "Flagged" },
  ];

  const statsData = [
    {
      title: "Active Users",
      value: "12,345",
      change: "+12%",
      icon: <FiUsers className="w-6 h-6" />,
    },
    {
      title: "New Sign-ups",
      value: "2,567",
      change: "+8%",
      icon: <FiUserPlus className="w-6 h-6" />,
    },
    {
      title: "Content Activity",
      value: "45.2K",
      change: "+15%",
      icon: <FiActivity className="w-6 h-6" />,
    },
  ];

  const userTrendsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "User Engagement",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const demographicsData = {
    labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const locationData = {
    labels: ["NA", "EU", "ASIA", "SA", "AF", "OC"],
    datasets: [
      {
        label: "Users by Region",
        data: [4500, 3800, 3200, 2100, 1800, 1200],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle Sidebar"
            >
              ☰
            </button>
          </div>
          <nav className="mt-8 space-y-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === "overview" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              <FiUsers className="mr-3" />
              {sidebarOpen && "Overview"}
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === "users" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              <FiMessageSquare className="mr-3" />
              {sidebarOpen && "Users"}
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === "content" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              <MdOutlineContentPaste className="mr-3" />
              {sidebarOpen && "Content"}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === "settings" ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
            >
              <FiSettings className="mr-3" />
              {sidebarOpen && "Settings"}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Statistics Overview */}
        {activeTab === "overview" && (
           <div className="max-w-7xl mx-auto">
           <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
   
           {/* Statistics Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             {statsData.map((stat, index) => (
               <div
                 key={index}
                 className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                 role="region"
                 aria-label={`${stat.title} statistics`}
               >
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-gray-600">{stat.title}</p>
                     <h2 className="text-2xl font-bold text-gray-800">
                       {stat.value}
                     </h2>
                     <span className="text-sm text-green-500">{stat.change}</span>
                   </div>
                   <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                     {stat.icon}
                   </div>
                 </div>
               </div>
             ))}
           </div>
   
           {/* Charts Section */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
             <div className="bg-white rounded-lg p-6 shadow-lg">
               <h3 className="text-xl font-semibold mb-4">User Engagement Trends</h3>
               <Line data={userTrendsData} options={{ responsive: true }} />
             </div>
             <div className="bg-white rounded-lg p-6 shadow-lg">
               <h3 className="text-xl font-semibold mb-4">Demographics</h3>
               <Doughnut data={demographicsData} options={{ responsive: true }} />
             </div>
           </div>
   
           {/* Location Statistics */}
           <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
             <div className="flex items-center mb-4">
               <BsGlobe className="w-6 h-6 text-blue-600 mr-2" />
               <h3 className="text-xl font-semibold">Geographic Distribution</h3>
             </div>
             <Bar data={locationData} options={{ responsive: true }} />
           </div>
   
           {/* System Status */}
           <div className="bg-white rounded-lg p-6 shadow-lg">
             <h3 className="text-xl font-semibold mb-4">System Status</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-green-100 rounded-lg">
                 <p className="text-green-800 font-medium">All Systems Operational</p>
                 <p className="text-sm text-green-600">Last updated: 5 mins ago</p>
               </div>
               <div className="p-4 bg-blue-100 rounded-lg">
                 <p className="text-blue-800 font-medium">Server Response Time</p>
                 <p className="text-sm text-blue-600">Average: 245ms</p>
               </div>
             </div>
           </div>
         </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dummyUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Moderation */}
        {activeTab === "content" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Content Moderation</h2>
            <div className="space-y-4">
              {dummyContent.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{item.user}</h3>
                      <p className="text-gray-500 text-sm">{item.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.status === "Approved" ? "bg-green-100 text-green-800" :
                      item.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{item.content}</p>
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Approve</button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Flag</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Theme Preferences</h3>
                  <div className="flex items-center space-x-4">
                    <button className="w-8 h-8 rounded-full bg-blue-500"></button>
                    <button className="w-8 h-8 rounded-full bg-green-500"></button>
                    <button className="w-8 h-8 rounded-full bg-purple-500"></button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" />
                      <span className="ml-2">Email Notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" />
                      <span className="ml-2">Push Notifications</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Privacy</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" />
                      <span className="ml-2">Public Profile</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-500" />
                      <span className="ml-2">Show Online Status</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
