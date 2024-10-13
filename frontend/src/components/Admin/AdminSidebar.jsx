import { FaUser, FaQuestionCircle, FaPlus, FaCogs } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside
      style={{ fontFamily: "Lexend" }}
      className="min-h-screen bg-violet-700 w-64 text-white shadow-lg"
    >
      {/* Sidebar Header */}
      <div className="p-6 text-3xl font-bold text-center">Admin Panel</div>

      {/* Sidebar Links */}
      <ul className="space-y-4 mt-8">
        {/* Dashboard Overview */}
        <li>
          <Link
            to="/admin-dashboard/dashboard"
            className="flex items-center space-x-3 p-4 hover:bg-violet-800 rounded-md transition duration-200"
          >
            <FaCogs size={25} />
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Manage Quizzes */}
        <li>
          <Link
            to="/admin-dashboard/manage-quizzes"
            className="flex items-center space-x-3 p-4 hover:bg-violet-800 rounded-md transition duration-200"
          >
            <FaQuestionCircle size={25} />
            <span>Manage Quizzes</span>
          </Link>
        </li>
        {/* Manage Users */}
        <li>
          <Link
            to="/admin-dashboard/manage-users"
            className="flex items-center space-x-3 p-4 hover:bg-violet-800 rounded-md transition duration-200"
          >
            <FaUser size={25} />
            <span>Manage Users</span>
          </Link>
        </li>

        {/* Manage Admins */}
        <li>
          <Link
            to="/admin-dashboard/manage-admins"
            className="flex items-center space-x-3 p-4 hover:bg-violet-800 rounded-md transition duration-200"
          >
            <FaUser size={25} />
            <span>Manage Admins</span>
          </Link>
        </li>

        {/* Log out */}
        <li>
          <Link
            to="/admin-dashboard/quizzes/new"
            className="flex items-center hover:bg-violet-800 space-x-3 p-4 rounded-md transition duration-200"
          >
            <FaPlus size={25} />
            <span>Log out</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
