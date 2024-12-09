import React, { useState } from "react";
import Users from "./Users";
import Clients from "./Clients"

const Dashboard = () => {
  const [view, setView] = useState("users");

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page or refresh the app (depends on your routing setup)
    window.location.href = "/"; // Adjust the path as necessary
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-6 py-2 font-semibold rounded shadow-md transform hover:scale-105 transition-all ${
              view === "users"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setView("users")}
          >
            Users
          </button>
          <button
            className={`px-6 py-2 font-semibold rounded shadow-md transform hover:scale-105 transition-all ${
              view === "clients"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            onClick={() => setView("clients")}
          >
            Clients
          </button>
        </div>
        <button
          className="px-6 py-2 font-semibold bg-red-600 rounded shadow-md transform hover:scale-105 transition-all hover:bg-red-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>
      <main className="max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        {view === "users" && <Users />}
        {view === "clients" && (
          <div className="text-center text-xl font-light">
            <Clients/>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
