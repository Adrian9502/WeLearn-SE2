import AdminSidebar from "./AdminSidebar";
import { Routes, Route } from "react-router-dom";
import CreateQuiz from "./CRUD/CreateQuiz";
import ManageQuizzes from "./CRUD/ManageQuizzes";
import ManageUsers from "./CRUD/ManageUsers";
import AdminDashboard from "./AdminDashboard";
import ManageAdmins from "./CRUD/ManageAdmins";
export default function AdminPages() {
  return (
    <div className="flex text-white">
      <AdminSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-quizzes" element={<ManageQuizzes />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-admins" element={<ManageAdmins />} />
          <Route path="quizzes/new" element={<CreateQuiz />} />
        </Routes>
      </div>
    </div>
  );
}
