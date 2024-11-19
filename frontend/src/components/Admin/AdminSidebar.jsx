import React, { useState, useEffect } from "react";
import { FaUser, FaQuestionCircle, FaCogs, FaChartLine } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiLogoutBoxLine, RiMenuLine, RiCloseLine } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";

import { RiAdminFill } from "react-icons/ri";
import axios from "axios";
import Swal from "sweetalert2";
const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");

  // get the admin username to display
  useEffect(() => {
    // Get the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin dashboard",
      icon: "warning",
      showCancelButton: true,

      confirmButtonText: "Yes, logout",
      background: "#1e293b", // Dark background
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      color: "#fff", // White text
      customClass: {
        popup: "border border-slate-700",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Send logout request to server
        axios
          .post("/api/logout", {}, { withCredentials: true }) // Make sure to include credentials
          .then(() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("username");
            Swal.fire({
              title: "Logged Out!",
              text: "You have been successfully logged out.",
              icon: "success",
              background: "#1e293b",
              color: "#fff",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              navigate("/admin"); // Redirect to login page
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "There was an error logging you out. Please try again.",
              icon: "error",
              background: "#1e293b",
              color: "#fff",
            });
          });
      }
    });
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
          {/* admin */}
          <div className="px-3 py-2 border-b-2 border-cyan-500/30 my-4 sm:mt-6 text-cyan-400 flex items-center justify-center">
            <div className="min-w-fit">
              <MdAdminPanelSettings size={30} />
            </div>
            <span className="ml-2 truncate text-xl font-semibold text-slate-200">
              {username ? username : "Guest"}
            </span>
          </div>
          {links.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={index}
                to={link.path}
                className={`flex items-center space-x-3 p-4 rounded-lg mb-4 transition-all duration-200
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
            className="flex items-center space-x-3 p-4 rounded-lg w-full mt-8 hover:bg-red-500/10 transition-all duration-200 text-red-400 group"
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
