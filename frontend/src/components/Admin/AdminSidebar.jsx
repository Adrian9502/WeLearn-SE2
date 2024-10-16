import React from "react";
import { FaUser, FaQuestionCircle, FaCogs } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem("authToken");
    // Redirect to the login page
    navigate("/");
  };

  const links = [
    {
      path: "/admin-dashboard/",
      icon: <FaCogs size={25} />,
      label: "Dashboard",
    },
    {
      path: "/admin-dashboard/manage-quizzes",
      icon: <FaQuestionCircle size={25} />,
      label: "Manage Quizzes",
    },
    {
      path: "/admin-dashboard/manage-users",
      icon: <FaUser size={25} />,
      label: "Manage Users",
    },
    {
      path: "/admin-dashboard/manage-admins",
      icon: <FaUser size={25} />,
      label: "Manage Admins",
    },
  ];

  return (
    <aside
      style={{ fontFamily: "Lexend" }}
      className="min-h-screen bg-violet-700 w-64 text-white shadow-lg"
    >
      {/* Sidebar Header */}
      <div className="p-6 text-3xl font-bold text-center">Admin Panel</div>

      {/* Sidebar Links */}
      <ul className="space-y-4 mt-8">
        {links.map(({ path, icon, label }, index) => (
          <li key={index}>
            <Link
              to={path}
              className="flex items-center space-x-3 p-4 hover:bg-violet-800 rounded-md transition duration-200"
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-4 hover:bg-violet-800 rounded-md transition duration-200 w-full"
          >
            <RiLogoutBoxLine size={25} />
            <span>Log out</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
