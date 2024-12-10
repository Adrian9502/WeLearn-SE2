import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../../../../../utils/axios";

export default function ProfilePicture({ userId, username }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const defaultProfilePic =
    "https://cdn-icons-png.freepik.com/512/6858/6858441.png";

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await api.get(`/api/users/${userId}/profile-picture`);
        if (response.data && response.data.profilePicture) {
          setProfilePicture(response.data.profilePicture);
        } else {
          setProfilePicture(defaultProfilePic);
        }
      } catch (error) {
        console.error(`Error fetching profile picture for ${username}:`, error);
        setProfilePicture(defaultProfilePic);
      }
    };

    if (userId) {
      fetchProfilePicture();
    }
  }, [userId, username]);

  return (
    <div className="rounded-full w-10 h-10 overflow-hidden">
      <img
        src={profilePicture || defaultProfilePic}
        alt={`${username}'s profile`}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error("Error loading profile picture");
          e.target.src = defaultProfilePic;
        }}
      />
    </div>
  );
}

ProfilePicture.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};
