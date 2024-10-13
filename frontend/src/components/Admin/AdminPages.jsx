import AdminSidebar from "./AdminSidebar";
import { Routes, Route } from "react-router-dom";
import ManageQuizzes from "./ManageQuiz/ManageQuizzes";

import AdminDashboard from "./AdminDashboard";

export default function AdminPages() {
  return (
    <div className="flex text-white">
      <AdminSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-quizzes" element={<ManageQuizzes />} />
          {/* <Route path="manage-users" element={< />} />
          <Route path="manage-admins" element={< />} /> */}
        </Routes>
      </div>
    </div>
  );
}
