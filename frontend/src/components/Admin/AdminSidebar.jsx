import { FaUser, FaQuestionCircle, FaPlus, FaCogs } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function AdminSidebar() {
  return (
    <aside className="h-screen w-64 bg-gray-900 text-white">
      <div className="p-6 text-2xl font-bold">Admin Panel</div>
      <ul className="space-y-6 mt-8">
        {/* Dashboard Overview */}
        <li>
          <Link
            to="/admin-dashboard"
            className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-md"
          >
            <FaCogs />
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Manage Quizzes */}
        <li>
          <Link
            to="/admin-dashboard/quizzes"
            className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-md"
          >
            <FaQuestionCircle />
            <span>Manage Quizzes</span>
          </Link>
        </li>

        {/* Add New Quiz */}
        <li>
          <Link
            to="/admin-dashboard/quizzes/new"
            className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-md"
          >
            <FaPlus />
            <span>Create New Quiz</span>
          </Link>
        </li>

        {/* Manage Users */}
        <li>
          <Link
            to="/admin-dashboard/users"
            className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-md"
          >
            <FaUser />
            <span>Manage Users</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
