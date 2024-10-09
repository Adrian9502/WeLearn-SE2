import { FaUser, FaQuestionCircle, FaPlus, FaCogs } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="h-screen w-64 custom-border-sidebar text-white shadow-lg">
      {/* Sidebar Header */}
      <div className="p-6 text-3xl border custom-border font-bold text-center text-yellow-400">
        Admin Panel
      </div>

      {/* Sidebar Links */}
      <ul className="space-y-4 mt-8">
        {/* Dashboard Overview */}
        <li>
          <Link
            to="/admin-dashboard/dashboard"
            className="flex items-center space-x-3 p-4 rounded-md transition duration-200"
          >
            <FaCogs className="text-yellow-400" />
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Manage Quizzes */}
        <li>
          <Link
            to="/admin-dashboard/manage-quizzes"
            className="flex items-center space-x-3 p-4 rounded-md transition duration-200"
          >
            <FaQuestionCircle className="text-yellow-400" />
            <span>Manage Quizzes</span>
          </Link>
        </li>
        {/* Manage Users */}
        <li>
          <Link
            to="/admin-dashboard/manage-users"
            className="flex items-center space-x-3 p-4  rounded-md transition duration-200"
          >
            <FaUser className="text-yellow-400" />
            <span>Manage Users</span>
          </Link>
        </li>

        {/* Manage Admins */}
        <li>
          <Link
            to="/admin-dashboard/manage-admins"
            className="flex items-center space-x-3 p-4  rounded-md transition duration-200"
          >
            <FaUser className="text-yellow-400" />
            <span>Manage Admins</span>
          </Link>
        </li>

        {/* Add New Quiz */}
        <li>
          <Link
            to="/admin-dashboard/quizzes/new"
            className="flex items-center space-x-3 p-4 rounded-md transition duration-200"
          >
            <FaPlus className="text-yellow-400" />
            <span>Create New Quiz</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
