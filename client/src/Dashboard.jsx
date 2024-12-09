import React, { useState } from "react";
import Users from "./Users";

const Dashboard = () => {
  const [view, setView] = useState("users");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4">
      <header className="flex justify-center space-x-4 mb-6">
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
      </header>
      <main className="max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        {view === "users" && <Users />}
        {view === "clients" && (
          <div className="text-center text-xl font-light">
            Clients view is under construction 🚧
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
