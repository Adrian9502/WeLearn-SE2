import React, { useState, useEffect, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiLogoutBoxLine, RiMenuLine, RiCloseLine } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import Links from "./components/AdminSidebar/Links";
import api from "../../utils/axios";
import Swal from "sweetalert2";
const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);
  const defaultProfilePic =
    "https://cdn-icons-png.freepik.com/512/6858/6858441.png";

  useEffect(() => {
    const originalTitle = document.title;
    document.title = "WeLearn - Admin";

    // Get the admin data
    const fetchAdminData = async () => {
      try {
        const adminId = localStorage.getItem("adminId");
        if (adminId) {
          const response = await api.get(
            `/api/admins/${adminId}/profile-picture`,
            {
              withCredentials: true,
              timeout: 5000, // Reduce timeout to 5 seconds
            }
          );

          if (response.data && response.data.profilePicture) {
            setProfilePicture(response.data.profilePicture);
          } else {
            setProfilePicture(defaultProfilePic);
          }
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePicture(defaultProfilePic);
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

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of the admin dashboard",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout",
        background: "#1e293b",
        color: "#fff",
      });

      if (result.isConfirmed) {
        await api.post("/api/logout", {}, { withCredentials: true });

        // Clear localStorage
        localStorage.removeItem("adminId");
        localStorage.removeItem("username");
        localStorage.removeItem("authToken");

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
      }
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: "There was an error logging out. Please try again.",
        background: "#1e293b",
        color: "#fff",
      });
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handlePictureUpdate = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }

      const compressedFile = await compressImage(file);

      // Convert file to base64 for Cloudinary
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        try {
          const base64data = reader.result;
          const adminId = localStorage.getItem("adminId");
          console.log("Uploading image for admin:", adminId);

          const response = await api.post(
            `/api/admins/profile-picture/${adminId}`,
            {
              image: base64data,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Upload complete:", response.data);
          if (response.data.profilePicture) {
            setProfilePicture(response.data.profilePicture);
          } else {
            throw new Error("No profile picture URL in response");
          }
        } catch (error) {
          console.error("Upload error details:", error);
          alert(
            error.response?.data?.message ||
              "Failed to update profile picture. Please try again."
          );
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        alert("Error reading file. Please try again.");
      };
    } catch (error) {
      console.error("Image compression error:", error);
      alert("Failed to compress image. Please try again.");
    }
  };

  // Helper function to compress images
  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof Blob)) {
        reject(new Error("Invalid file"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }
              resolve(
                new File([blob], file.name || "profile.jpg", {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            },
            "image/jpeg",
            0.7
          );
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        data-testid="mobile-menu-button"
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
        data-testid="profile-picture-input"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif"
        onChange={handlePictureUpdate}
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
        data-testid="admin-sidebar"
        className={`fixed inset-y-0 left-0 bg-slate-950 text-white w-64 transform transition-transform duration-300 ease-in-out z-50 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        border-r border-slate-800/50`}
      >
        <div className="p-6">
          <div className="flex items-center justify-center">
            <span
              data-testid="admin-logo"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >
              WeLearn <span className="text-sm">Admin</span>
            </span>
          </div>
        </div>
        <nav className="mt-6 px-3">
          {/* admin */}
          <div className="px-3 py-4 border-b-2 border-cyan-500/30 my-4 sm:mt-6 text-cyan-400">
            <div className="flex flex-col items-center space-y-3">
              <div
                data-testid="profile-picture-container"
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  data-testid="admin-profile-image"
                  src={profilePicture || defaultProfilePic}
                  alt="Admin Profile"
                  className="w-[80px] h-[80px] rounded-full object-cover border-2 border-cyan-400 transition-opacity duration-200"
                  onError={(e) => {
                    console.error("Error loading image");
                    e.target.src = defaultProfilePic;
                  }}
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
              <span
                data-testid="admin-username"
                className="text-xl font-semibold text-slate-200 text-center"
              >
                {username ? username : "Guest"}
              </span>
            </div>
          </div>
          {Links.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={index}
                data-testid={`nav-link-${link.label
                  .toLowerCase()
                  .replace(" ", "-")}`}
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
            data-testid="logout-button"
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
