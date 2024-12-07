import React from "react";
import PropTypes from "prop-types";
const ActionButton = ({ icon: Icon, label, onClick, variant = "primary" }) => (
  <button
    onClick={onClick}
    className={`flex rounded-lg items-center bg-gradient-to-r gap-2 px-4 py-2 transition-all ${
      variant === "primary"
        ? "from-emerald-500 to-green-700"
        : variant === "danger"
        ? "from-pink-500 to-red-600"
        : "from-orange-500 to-red-600"
    } hover:shadow-lg`}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

ActionButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.string,
};

export default ActionButton;
