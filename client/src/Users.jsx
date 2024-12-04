import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState(""); // For raw file content (editable)
  const [newEntry, setNewEntry] = useState(""); // For adding new entries

  // Fetch the file content on load
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch the users from the backend
  const fetchUsers = () => {
    axios
      .get("http://10.123.13.107:3000/users")
      .then((response) => {
        setUsers(response.data);
        toast.success("User list refreshed successfully!");
      })
      .catch((error) => toast.error("Error fetching users: " + error.message));
  };

  // Function to restart FreeRADIUS
  const restartFreeRADIUS = () => {
    axios
      .post("http://10.123.13.107:3000/restart")
      .then(() => toast.success("FreeRADIUS restarted successfully!"))
      .catch((error) =>
        toast.error("Failed to restart FreeRADIUS: " + error.message)
      );
  };

  // Function to add a new entry
  const handleSubmit = () => {
    const payload = { newEntry };
    axios
      .post("http://10.123.13.107:3000/users", payload)
      .then(() => {
        toast.success("User added successfully!");
        setNewEntry(""); // Clear the input field
      })
      .catch((error) => toast.error("Failed to add user: " + error.message));
  };

  // Function to update the file
  const handleUpdate = () => {
    axios
      .put("http://10.123.13.107:3000/users", { updatedContent: users })
      .then(() => {
        toast.success("File updated successfully!");
      })
      .catch((error) => toast.error("Failed to update file: " + error.message));
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Toaster Component */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center space-x-4">
        {/* Refresh Button */}
        <button
          className="px-6 py-2 bg-blue-900 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
          onClick={fetchUsers}
        >
          Refresh User List
        </button>

        {/* Restart FreeRADIUS Button */}
        <button
          className="px-6 py-2 bg-blue-900 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
          onClick={restartFreeRADIUS}
        >
          Restart FreeRADIUS
        </button>
      </div>

      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        {/* Left Side: Add New Entry */}
        <div className="w-full lg:w-1/2 p-6 bg-gray-800 text-gray-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gradient">
            Add New User
          </h2>
          <textarea
            className="w-full h-64 p-4 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new user entry here..."
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
          <button
            className="mt-4 w-full bg-blue-900 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        {/* Right Side: Editable Users File */}
        <div className="w-full lg:w-1/2 p-6 bg-gray-800 text-gray-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gradient">
            Edit Users File
          </h2>
          <textarea
            className="w-full h-64 p-4 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg focus:outline-none"
            value={users} // Bind to the raw file content
            onChange={(e) => setUsers(e.target.value)} // Update the content as the user types
          />
          <button
            className="self-right mt-4 w-full bg-blue-900 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all"
            onClick={handleUpdate} // Save the changes
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
