import React, { useState } from "react";
import { X } from "lucide-react";
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size too large. Please select an image under 5MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !userId) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      const response = await fetch(`/api/users/${userId}/profile-picture`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update profile picture"
        );
      }

      const data = await response.json();
      onUpdate(`http://localhost:5000${data.profilePicture}`);
      onClose();
    } catch (error) {
      console.error("Error updating profile picture:", error);
      setError(error.message || "Failed to update profile picture");
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
          className="absolute right-4 top-2 text-white/80 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-center text-sm text-yellow-400 sm:text-xl mb-6">
          Update Profile Picture
        </h2>

        <div className="space-y-6">
          {/* Current/Preview Image */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-purple-500 to-yellow-400 rounded-full p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-indigo-900">
                <img
                  src={previewUrl || currentPicture || "/user-profile.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* File Input */}
          <div className="flex flex-col items-center gap-4">
            <label className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="btn w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:to-blue-700 text-white py-2 px-3 sm:py-3 sm:px-6 transition-all duration-200 text-center">
                Choose Image
              </div>
            </label>

            <button
              onClick={handleSubmit}
              disabled={!selectedFile || isUploading}
              className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:to-emerald-700 text-white py-2 px-3 sm:py-3 sm:px-6 btn transition-all duration-200 ${
                (!selectedFile || isUploading) &&
                "opacity-50 cursor-not-allowed"
              }`}
            >
              {isUploading ? "Uploading..." : "Update Picture"}
            </button>
          </div>
          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm text-center mt-2">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
