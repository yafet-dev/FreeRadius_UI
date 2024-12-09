import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4">
      <Router>
        <Routes>
          {/* Public route: Login */}
          <Route path="/" element={<Login />} />

          {/* Protected route: Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
