import PropTypes from "prop-types";
import React from "react";

const SortButton = ({ label, action }) => (
  <button
    className="px-4 py-1.5 gap-2 bg-gradient-to-l from-sky-400 to-indigo-500 rounded-lg transition-colors"
    onClick={action}
  >
    <div className="text-sm text-nowrap font-medium">{label}</div>
  </button>
);

SortButton.propTypes = {
  label: PropTypes.node.isRequired,
  action: PropTypes.func.isRequired,
};

export default SortButton;
