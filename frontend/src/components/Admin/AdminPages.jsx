import AdminSidebar from "./AdminSidebar";
import { Routes, Route } from "react-router-dom";
import ManageQuizzes from "./ManageQuiz/ManageQuizzes";
import ManageUsers from "./ManageUsers/ManageUsers";
import AdminDashboard from "./AdminDashboard";
import ManageAdmins from "./ManageAdmins/ManageAdmins";

export default function AdminPages() {
  return (
    <div className="min-h-screen bg-slate-900">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />

          <Route path="manage-quizzes" element={<ManageQuizzes />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-admins" element={<ManageAdmins />} />
        </Routes>
      </main>
    </div>
  );
}
