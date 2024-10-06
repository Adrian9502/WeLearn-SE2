import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./User/UserDashboard";
import AdminDashboard from "./Admin/AdminPages";
import Login from "./login/Login";
import CreateQuiz from "./Admin/CRUD/CreateQuiz";
import ManageQuiz from "./Admin/CRUD/ManageQuiz";
import ManageUsers from "./Admin/CRUD/ManageUsers";
export default function Pages() {
  return (
    <Router>
      <Routes>
        {/* LOGIN AND DASHBOARD */}
        <Route path="/" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* ADMIN DASHBOARD */}

        {/* Main content area with routing */}

        {/* Route for the admin dashboard overview */}
        <Route exact path="/admin-dashboard" element={<AdminDashboard />} />

        {/* CRUD Routes for Quizzes */}
        <Route path="/admin/quizzes/new" component={<CreateQuiz />} />
        <Route path="/admin/quizzes" exact component={<ManageQuiz />} />

        {/* Route for managing users */}
        <Route path="/admin/users" component={<ManageUsers />} />

        {/* Default redirect to dashboard */}
        <Route path="/" exact component={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
