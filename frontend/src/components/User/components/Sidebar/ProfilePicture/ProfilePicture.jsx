import React, { useState } from "react";
import PropTypes from "prop-types";
export default function ProfilePicture({ userId, username }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="rounded-full w-10 h-10 overflow-hidden">
        <img src={`/default-profile.png`} className="w-10 h-10 object-cover" />
      </div>
    );
  }

  return (
    <div className="rounded-full w-10 h-10 overflow-hidden">
      <img
        src={`/api/users/${userId}/profile-picture`}
        alt={`${username}'s profile`}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

ProfilePicture.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};
