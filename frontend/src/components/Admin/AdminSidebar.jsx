import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaQuestionCircle,
  FaChartLine,
  FaCamera,
} from "react-icons/fa";
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
  const [profilePicture, setProfilePicture] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "WeLearn - Admin";

    // Get the admin data
    const fetchAdminData = async () => {
      try {
        const adminId = localStorage.getItem("adminId");
        if (adminId) {
          const response = await axios.get(
            `/api/admins/${adminId}/profile-picture`,
            {
              withCredentials: true,
            }
          );
          setProfilePicture(
            `http://localhost:5000${response.data.profilePicture}`
          );
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePicture("/uploads/default-profile.png"); // Fallback to default
      }
    };

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    fetchAdminData();

    return () => {
      document.title = originalTitle;
    };
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
  const handleProfilePictureUpdate = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        title: "Error",
        text: "Please select a valid image file (JPEG, PNG, or GIF)",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "Error",
        text: "File size must be less than 5MB",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
      });
      return;
    }

    // Show loading state
    Swal.fire({
      title: "Uploading...",
      text: "Please wait while we update your profile picture",
      allowOutsideClick: false,
      showConfirmButton: false,
      background: "#1e293b",
      color: "#fff",
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const adminId = localStorage.getItem("adminId");
      const response = await axios.put(
        `/api/admins/${adminId}/profile-picture`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfilePicture(`http://localhost:5000${response.data.profilePicture}`);

      Swal.fire({
        title: "Success",
        text: "Profile picture updated successfully",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update profile picture. Please try again.",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
      });
    }
  };
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
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif"
        onChange={handleProfilePictureUpdate}
      />
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
          <div className="px-3 py-4 border-b-2 border-cyan-500/30 my-4 sm:mt-6 text-cyan-400">
            <div className="flex flex-col items-center space-y-3">
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={profilePicture || "/uploads/default-profile.png"}
                  alt="Admin Profile"
                  className="w-[80px] h-[80px] rounded-full object-cover border-2 border-cyan-400 transition-opacity duration-200"
                />

                {/* Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity duration-200 ${
                    isHovering ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <FaCamera size={20} className="text-white" />
                    <span className="text-white text-xs mt-1">
                      Change <br /> Photo
                    </span>
                  </div>
                </div>

                {/* Admin Badge */}
                <div className="absolute bottom-0 right-0 bg-cyan-400 rounded-full p-1">
                  <MdAdminPanelSettings size={20} className="text-slate-950" />
                </div>
              </div>
              <span className="text-xl font-semibold text-slate-200 text-center">
                {username ? username : "Guest"}
              </span>
            </div>
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
