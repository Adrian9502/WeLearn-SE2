import React, { useState } from "react";
import { FaTrophy, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";

import PropTypes from "prop-types";
import ProgressDisplay from "./ProgressDisplay";
import RankingsDisplay from "./RankingDisplay";
export default function UserInfo({
  onLogout,
  username,
  coins,
  onShowProgress,
  onShowRankings,
  onShowDailyRewards,
}) {
  return (
    <div className="relative p-6 my-8 bg-gradient-to-b from-purple-800/80 to-indigo-700/80 rounded-xl shadow-2xl">
      {/* Decorative Elements */}
      <div className="absolute rounded-tr-lg rounded-tl-lg top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-yellow-500 to-purple-500" />
      <div className="absolute rounded-br-lg rounded-bl-lg bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-purple-600 to-yellow-500" />

      <div className="relative z-10 sm:space-y-6 space-y-">
        <h1 className="text-center text-yellow-400 sm:text-xl font-game mb-3 sm:mb-6">
          PLAYER STATUS
        </h1>

        {/* Player Card */}
        <div className="bg-gradient-to-b from-[#622aff] to-[#622aff]/90 rounded-xl p-3 mb-3 sm:p-4 border-2 border-white/20">
          {/* Avatar */}
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-purple-500 to-yellow-400 rounded-full p-1">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src="/user-profile.png"
                  alt="User"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Player Info */}
          <div>
            <div className="text-center">
              <span className="text-yellow-300 text-sm font-game">
                PLAYER NAME
              </span>
              <h2 className="text-white text-lg my-1">{username}</h2>
            </div>

            <div className="flex items-center border-2 justify-center bg-indigo-900/50 rounded-xl p-1 border-purple-600">
              <img src="/coin.gif" className="w-8 h-8 mr-2" alt="Coins" />
              <span className="text-yellow-400 text-lg font-game">{coins}</span>
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
  );
}
UserInfo.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string,
  coins: PropTypes.number.isRequired,
  userProgress: PropTypes.array,
};
