import React, { useState } from "react";
import { FaUser, FaQuestionCircle, FaCogs, FaChartLine } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiLogoutBoxLine, RiMenuLine, RiCloseLine } from "react-icons/ri";
import { RiAdminFill } from "react-icons/ri";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const links = [
    {
      path: "/admin-dashboard/",
      icon: <FaChartLine size={20} />,
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
      icon: <RiAdminFill size={20} />,
      label: "Manage Admins",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-800 p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <RiCloseLine size={24} className="text-white" />
        ) : (
          <RiMenuLine size={24} className="text-white" />
        )}
      </button>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-950 text-white w-64 transform transition-transform duration-300 ease-in-out z-50 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        border-r border-slate-800/50`}
      >
        <div className="p-6">
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              WeLearn <span className="text-sm">Admin</span>
            </span>
          </div>
        </div>

        <nav className="mt-6 px-3">
          {links.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={index}
                to={link.path}
                className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-400 border border-indigo-500/20"
                      : "hover:bg-slate-800 border-transparent border"
                  }
                `}
              >
                <span className={isActive ? "text-cyan-400" : "text-slate-400"}>
                  {link.icon}
                </span>
                <span
                  className={`font-medium ${
                    isActive ? "text-cyan-400" : "text-slate-300"
                  }`}
                >
                  {link.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg w-full mt-8 hover:bg-red-500/10 transition-all duration-200 text-red-400 group"
          >
            <RiLogoutBoxLine size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>{" "}
    </>
  );
};

export default AdminSidebar;
