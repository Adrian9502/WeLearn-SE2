import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUser } from "../../../UserContext";

const ProfilePictureModal = ({
  isOpen,
  onClose,
  onUpdate,
  currentPicture,
  userId,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user, updateUser } = useUser();
  const PROFILE_PICTURE_COST = 500;

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      setUploadProgress(0);
    }
  }, [isOpen]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    if (user.coins < PROFILE_PICTURE_COST) {
      setError(
        `You need ${PROFILE_PICTURE_COST} coins to change your profile picture`
      );
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      await onUpdate(selectedFile);

      const newCoins = user.coins - PROFILE_PICTURE_COST;
      updateUser({ coins: newCoins });

      await fetch(`/api/users/${userId}/coins`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coins: PROFILE_PICTURE_COST,
          operation: "subtract",
        }),
      });

      onClose();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error uploading profile picture. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-gradient-to-b from-purple-800 to-indigo-700 btn p-4 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/80 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-center text-sm text-yellow-400 mb-4 sm:text-lg">
          Update Profile Picture
        </h2>
        <div className="text-center text-xs text-slate-200 mb-4">
          <div className="flex items-center w-fit mx-auto p-1 rounded-lg bg-fuchsia-600 border-yellow-500 text-base border-2 justify-center">
            <img src="/coin.gif" className="w-6 h-6" alt="" /> -
            {PROFILE_PICTURE_COST} coins
          </div>
          <br />
          <div className="p-1">Your balance: {user?.coins || 0} coins</div>
        </div>

        {previewUrl && (
          <div className="">
            <img
              src={previewUrl || currentPicture || "/default-profile.png"}
              alt="Preview"
              className="w-24 h-24 border-4 border-yellow-400 mb-2 object-cover rounded-full mx-auto"
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-center text-sm font-medium text-slate-200">
              Select Image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileSelect}
              className="w-full text-xs text-pink-500 block
                file:mr-2 file:py-2 file:px-2.5
                file:rounded-full file:border-0
                 file:font-semibold file:cursor-pointer transition-colors
                file:bg-blue-100 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {isUploading && (
            <div className="w-full my-2 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-slate-200 my-1 text-center">
                {uploadProgress}%
              </p>
            </div>
          )}

          {error && (
            <div className="text-yellow-300 text-xs p-2 text-center bg-red-500 rounded-xl sm:text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-center space-x-2 pt-4">
            <button
              type="submit"
              className="px-4 py-2 btn cursor-pointer transition-colors text-sm font-medium text-slate-200 bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
