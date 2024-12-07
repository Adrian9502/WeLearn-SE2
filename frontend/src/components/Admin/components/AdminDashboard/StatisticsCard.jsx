import React from "react";
import PropTypes from "prop-types";

const StatisticsCard = ({ title, children }) => (
  <div className="rounded-xl bg-slate-950 p-6 border border-slate-800">
    <h3 className="text-xl font-semibold mb-4 text-slate-200 flex items-center justify-around">
      {title}
    </h3>
    <div className="h-64 rounded-lg bg-slate-900/50 p-4">{children}</div>
  </div>
);

StatisticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default StatisticsCard;
