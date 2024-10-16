import AdminSidebar from "./AdminSidebar";
import { Routes, Route } from "react-router-dom";
import ManageQuizzes from "./ManageQuiz/ManageQuizzes";
import ManageUsers from "./ManageUsers/ManageUsers";
import AdminDashboard from "./AdminDashboard";
import ManageAdmins from "./ManageAdmins/ManageAdmins";

export default function AdminPages() {
  return (
    <div className="flex text-white">
      <AdminSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />

          <Route path="manage-quizzes" element={<ManageQuizzes />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-admins" element={<ManageAdmins />} />
        </Routes>
      </div>
    </div>
  );
}
