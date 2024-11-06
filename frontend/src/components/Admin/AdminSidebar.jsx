import React, { useState } from "react";
import { FaUser, FaQuestionCircle, FaCogs } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { RiLogoutBoxLine, RiMenuLine, RiCloseLine } from "react-icons/ri";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem("authToken");
    // Redirect to the login page
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const links = [
    {
      path: "/admin-dashboard/",
      icon: <FaCogs size={20} />,
      label: "Dashboard",
    },
    {
      path: "/admin-dashboard/manage-quizzes",
      icon: <FaQuestionCircle size={20} />,
      label: "Manage Quizzes",
    },
    {
      path: "/admin-dashboard/manage-users",
      icon: <FaUser size={20} />,
      label: "Manage Users",
    },
    {
      path: "/admin-dashboard/manage-admins",
      icon: <FaUser size={20} />,
      label: "Manage Admins",
    },
  ];

  return (
    <aside
      style={{ fontFamily: "Lexend" }}
      className={`bg-gradient-to-bl from-purple-700 to bg-indigo-700 p-3 shadow-lg text-slate-200 transition-all duration-300 z-50 ${
        isOpen ? "translate-x-0 w-0" : "-translate-x-full"
      } sm:translate-x-0 sm:static`}
    >
      {/* Sidebar Header */}
      <div className="p-6 text-2xl font-bold flex flex-col border-b text-center">
        <div className="flex justify-between items-center">
          <span>WeLearn Admin</span>

          <button className="sm:hidden" onClick={toggleSidebar}>
            {isOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
          </button>
        </div>
      </div>
      {/* Sidebar Links */}
      <ul className="mt-8 space-y-2">
        {links.map(({ path, icon, label }, index) => (
          <li key={index}>
            <Link
              to={path}
              className="flex items-center space-x-4 p-4 hover:bg-fuchsia-700 rounded-md transition duration-200"
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 p-4 hover:bg-gray-100 rounded-md transition duration-200 w-full"
          >
            <RiLogoutBoxLine size={20} />
            <span>Log out</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
