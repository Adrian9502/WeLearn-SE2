import React from "react";
import PropTypes from "prop-types";

const OverviewCard = ({ title, count, Icon }) => (
  <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] transition-all scale-[1.02]">
    <div className="relative rounded-xl bg-slate-950 p-7 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-slate-400 mb-2">{title}</h2>
          <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {count ? (
              count
            ) : (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            )}
          </div>
        </div>
        <Icon className="text-5xl text-cyan-400" />
      </div>
    </div>
  </div>
);

OverviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  Icon: PropTypes.elementType.isRequired,
};

export default OverviewCard;
