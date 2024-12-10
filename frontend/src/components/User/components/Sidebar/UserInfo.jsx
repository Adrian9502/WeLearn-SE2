import React, { useState, useEffect } from "react";
import { FaTrophy, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";
import PropTypes from "prop-types";
import ProfilePictureModal from "./ProfilePicture/ProfilePictureModal";
import api from "../../../../utils/axios";
import Swal from "sweetalert2";

export default function UserInfo({
  onLogout,
  username,
  coins,
  onShowProgress,
  onShowRankings,
  onShowDailyRewards,
  userData,
  onUserDataUpdate,
}) {
  // ------------ VARIABLES -------------
  const userId = userData?._id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(null);
  const defaultProfilePic =
    "https://cdn-icons-png.freepik.com/512/6858/6858441.png";
  const [isLoadingPicture, setIsLoadingPicture] = useState(true);

  //  ---------- FETCH USER PROFILE -------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingPicture(true);
        const response = await api.get(`/api/users/${userId}/profile-picture`, {
          withCredentials: true,
        });

        if (response.data && response.data.profilePicture) {
          setCurrentPicture(response.data.profilePicture);
        } else {
          setCurrentPicture(defaultProfilePic);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setCurrentPicture(defaultProfilePic);
      } finally {
        setIsLoadingPicture(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  //  ---------- FUNCTION TO UPDATE PROFILE PICTURE -------------
  const handlePictureUpdate = async (file) => {
    try {
      // Show loading alert
      Swal.fire({
        title: "Processing Image",
        html: "Please wait while we process your image...",
        width: 500,
        padding: "1em",
        color: "#c3e602",
        background:
          "#fff url(https://cdn.vectorstock.com/i/1000v/38/53/pixel-art-style-purple-gradient-background-vector-8473853.jpg",
        customClass: {
          popup: "swal-font",
          confirmButton: "btn primary",
          cancelButton: "btn show-btn",
        },
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const compressedFile = await compressImage(file);

      // Convert file to base64 for Cloudinary
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        try {
          const base64data = reader.result;
          console.log("Uploading image for user:", userId);

          // Validate image data
          if (!base64data || !base64data.startsWith("data:image")) {
            Swal.fire({
              icon: "error",
              title: "Invalid Image",
              text: "Please select a valid image file.",
              width: 500,
              padding: "1em",
              color: "#c3e602",
              background:
                "url(https://cdn.vectorstock.com/i/1000v/38/53/pixel-art-style-purple-gradient-background-vector-8473853.jpg",
              customClass: {
                popup: "swal-font",
                confirmButton: "btn primary",
                cancelButton: "btn show-btn",
              },
            });
            return;
          }

          const response = await api.post(
            `/api/users/profile-picture/${userId}`,
            {
              image: base64data,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 60000,
            }
          );

          console.log("Upload complete:", response.data);
          if (response.data.profilePicture) {
            setCurrentPicture(response.data.profilePicture);
            if (onUserDataUpdate) {
              onUserDataUpdate({
                ...userData,
                profilePicture: response.data.profilePicture,
              });
            }

            // Show success message
            Swal.fire({
              icon: "success",
              title: "Profile Picture Updated!",
              text: "Your profile picture has been successfully updated.",
              width: 500,
              padding: "1em",
              color: "#c3e602",
              background:
                "url(https://cdn.vectorstock.com/i/1000v/38/53/pixel-art-style-purple-gradient-background-vector-8473853.jpg",
              customClass: {
                popup: "swal-font",
                confirmButton: "btn primary",
                cancelButton: "btn show-btn",
              },
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
            throw new Error("No profile picture URL in response");
          }
        } catch (error) {
          console.error("Upload error details:", error);
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to update profile picture. Please try again.";

          Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: errorMessage,
            background: "#1e293b",
            color: "#fff",
          });
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        Swal.fire({
          icon: "error",
          title: "File Error",
          text: "Error reading the image file. Please try again.",
          background: "#1e293b",
          color: "#fff",
        });
      };
    } catch (error) {
      console.error("Image compression error:", error);
      Swal.fire({
        icon: "error",
        title: "Compression Failed",
        text: "Failed to compress image. Please try again with a different image.",
        background: "#1e293b",
        color: "#fff",
      });
    }
  };

  // Helper function to compress images
  const compressImage = async (file) => {
    return new Promise((resolve) => {
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
              resolve(
                new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            },
            "image/jpeg",
            0.7
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
  //  ---------- RETURN JSX -------------
  return (
    <>
      <div className="relative p-6 my-8 bg-gradient-to-b from-purple-800/80 to-indigo-700/80 rounded-xl shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute rounded-tr-lg rounded-tl-lg top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-yellow-500 to-purple-500" />
        <div className="absolute rounded-br-lg rounded-bl-lg bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-yellow-500" />

        <div className="relative z-10 sm:space-y-6 space-y-">
          <h1 className="text-center text-yellow-400 sm:text-xl font-game mb-3 sm:mb-6">
            PLAYER STATUS
          </h1>

          {/* PLAYER CARD */}
          <div className="bg-gradient-to-b from-[#622aff] to-[#622aff]/90 rounded-xl p-3 mb-3 sm:p-4 border-2 border-white/20">
            {/* PROFILE PICTURE */}
            <div
              className="relative w-20 h-20 mx-auto mb-4 cursor-pointer group"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-purple-500 to-yellow-400 rounded-full p-1">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {isLoadingPicture ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
                    </div>
                  ) : (
                    <img
                      src={currentPicture || defaultProfilePic}
                      alt={`${username}'s profile`}
                      className="w-full h-full object-cover transition-opacity duration-200"
                      onError={(e) => {
                        console.error("Error loading image");
                        e.target.src = defaultProfilePic;
                      }}
                    />
                  )}

                  {/* Hover overlay - only show when not loading */}
                  {!isLoadingPicture && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 rounded-full group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-center text-white text-xs">
                        Change Picture
                      </span>
                    </div>
                  )}
                </div>
              </div>{" "}
            </div>

            {/* PLAYER INFO */}
            <div>
              <div className="text-center">
                <span className="text-yellow-300 text-sm font-game">
                  PLAYER NAME
                </span>
                <h2 className="text-white text-lg my-1">{username}</h2>
              </div>

              <div className="flex items-center border-2 justify-center bg-indigo-900/50 rounded-xl p-1 border-purple-600">
                <img src="/coin.gif" className="w-8 h-8 mr-2" alt="Coins" />
                <span className="text-yellow-400 text-lg font-game">
                  {coins}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={onShowDailyRewards}
              className="btn text-sm sm:text-base w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:to-blue-700 text-white py-2 px-2 sm:py-3 sm:px-6 rounded-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaGift className="text-2xl" />
              DAILY REWARDS
            </button>
            <button
              onClick={onShowProgress}
              className="btn text-sm sm:text-base w-full bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:to-rose-700 text-white py-2 px-5 sm:py-3 sm:px-6 rounded-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaChartLine className="text-xl" />
              PROGRESS
            </button>

            <button
              onClick={onShowRankings}
              className="btn text-sm sm:text-base w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:to-orange-600 text-slate-800 font-game py-2 px-5 sm:py-3 sm:px-6 rounded-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaTrophy className="text-xl" />
              RANKINGS
            </button>

            <button
              onClick={onLogout}
              className="btn text-sm sm:text-base w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-game py-2 px-5 sm:py-3 sm:px-6 rounded-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaSignOutAlt className="text-xl" />
              LOG OUT
            </button>
          </div>
        </div>
      </div>
      {/* PROFILE PICTURE MODAL POP UP*/}
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handlePictureUpdate}
        currentPicture={currentPicture}
        userId={userId}
      />
    </>
  );
}
UserInfo.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string,
  coins: PropTypes.number.isRequired,
  onShowProgress: PropTypes.func.isRequired,
  onShowRankings: PropTypes.func.isRequired,
  onShowDailyRewards: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    _id: PropTypes.string,
    profilePicture: PropTypes.string,
  }),
  onUserDataUpdate: PropTypes.func,
};
