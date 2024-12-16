import React, { useState } from "react";
import { FiSettings, FiFilter, FiChevronDown, FiSearch, FiFlag, FiCheck, FiX, FiAlertTriangle } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEscalator } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import AdminLayout from "@/Layouts/Admin/AdminLayout";

const AdminReportManagement = ({reports}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dummyContent = [
    {
      id: 1,
      title: "Inappropriate Comment on Blog Post",
      reporter: "John Doe",
      timestamp: "2024-01-20T10:30:00",
      type: "text",
      severity: "high",
      status: "pending",
      content: "This is a reported comment that needs review..."
    },
    {
      id: 2,
      title: "Flagged Image in Community Forum",
      reporter: "Jane Smith",
      timestamp: "2024-01-20T09:15:00",
      type: "image",
      severity: "medium",
      status: "pending",
      content: "images.unsplash.com/photo-1518806118471-f28b20a1d79d"
    },
    {
      id: 3,
      title: "Reported Video Content",
      reporter: "Mike Johnson",
      timestamp: "2024-01-20T08:45:00",
      type: "video",
      severity: "low",
      status: "reviewed",
      content: "Reported video content link"
    }
  ];

  const handleAction = (action, itemId) => {
    if (window.confirm(`Are you sure you want to ${action} this content?`)) {
      toast.success(`Content ${action}d successfully!`);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const ContentList = () => (
    <div className="space-y-4">
      {reports.map((item) => (
        <div key={item.id} className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${getSeverityColor(item.severity)}`}></span>
                <h3 className="font-semibold text-lg">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">Reported by: {item.reporter}</p>
              <p className="text-sm text-gray-500">Time: {new Date(item.timestamp).toLocaleString()}</p>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 text-xs rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  {item.type}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAction("approve", item.id)}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                aria-label="Approve content"
              >
                <FiCheck className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleAction("delete", item.id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                aria-label="Delete content"
              >
                <RiDeleteBin6Line className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleAction("escalate", item.id)}
                className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                aria-label="Escalate content"
              >
                <MdEscalator className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SettingsPanel = () => (
    <div className={`fixed top-0 right-0 h-full w-80 ${darkMode ? "bg-gray-900" : "bg-gray-100"} p-6 shadow-lg transform ${showSettings ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Settings</h2>
        <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-200 rounded-full">
          <FiX className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5"
            />
            <span>Dark Mode</span>
          </label>
        </div>
        <div>
          <label className="block mb-2">Filter Content</label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className={`w-full p-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <option value="all">All Content</option>
            <option value="text">Text Only</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Content Moderation Dashboard</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md hover:shadow-lg transition-shadow`}
          >
            <FiSettings className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          <button className={`px-4 py-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md flex items-center space-x-2`}>
            <FiFilter className="w-5 h-5" />
            <span>Filter</span>
            <FiChevronDown className="w-5 h-5" />
          </button>
        </div>

        <ContentList />
        <SettingsPanel />
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

AdminReportManagement.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);

export default AdminReportManagement;