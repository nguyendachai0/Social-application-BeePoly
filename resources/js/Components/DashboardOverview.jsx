import { Line, Doughnut, Bar } from "react-chartjs-2";
import { FiUsers, FiUserPlus, FiActivity } from "react-icons/fi";
import { BsGlobe } from "react-icons/bs";
import React, { useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { MdOutlineContentPaste } from "react-icons/md";
const DashboardOverView = () => {


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
      );
}

export default DashboardOverView;