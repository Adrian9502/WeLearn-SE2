import AdminSidebar from "./AdminSidebar";
import { Routes, Route } from "react-router-dom";
import CreateQuiz from "./CRUD/CreateQuiz";
import ManageQuiz from "./CRUD/ManageQuiz";
import ManageUsers from "./CRUD/ManageUsers";
import AdminDashboard from "./CRUD/AdminDashboard";

export default function AdminPages() {
  return (
    <div className="bg-violet-700 flex text-white">
      <AdminSidebar />
      <div className="flex-1 p-10">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="quizzes" element={<ManageQuiz />} />
          <Route path="quizzes/new" element={<CreateQuiz />} />
          <Route path="users" element={<ManageUsers />} />
        </Routes>
      </div>
    </div>
  );
}
