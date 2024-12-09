import React, { useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate
  const API_BASE_URL = "http://yourip:port"; 

  const handleLogin = () => {
    // Validate input
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    axios
      .post(`${API_BASE_URL}/login`, { username, password })
      .then((response) => {
        const { token } = response.data;
        if (token) {
          localStorage.setItem("token", token);
          navigate("/dashboard");
          toast.success("Logged in successfully!");
        } else {
          toast.error("No token returned from server");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.error("Failed to login. Check credentials and try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-lg space-y-6">
        <h2 className="text-3xl font-semibold mb-4 text-center text-gradient">
          Login
        </h2>
        <div>
          <label
            className="block text-gray-400 mb-2 font-bold"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label
            className="block text-gray-400 mb-2 font-bold"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
