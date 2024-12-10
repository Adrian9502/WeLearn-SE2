import React, { useState, useEffect } from "react";
import { FaTrophy as Trophy } from "react-icons/fa";
import { useUser } from "../../UserContext";
import { Categories } from "./Ranking/Categories";
import ProfilePicture from "./ProfilePicture/ProfilePicture";
import PropTypes from "prop-types";
export default function RankingsDisplay({ onClose }) {
  // ----- STATES------
  const [rankings, setRankings] = useState({
    quizCompletion: [],
    speedsters: [],
    wealthiest: [],
    consistent: [],
    efficiency: [],
  });
  const [activeTab, setActiveTab] = useState("quizCompletion");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  // ----- USE EFFECTS -----
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/progress/rankings");
        const data = await response.json();

        const processedRankings = {
          quizCompletion: data.completionRankings,
          speedsters: data.timeRankings,
          wealthiest: data.coinRankings,
          consistent: data.consistencyRankings,
          efficiency: data.efficiencyRankings,
        };

        setRankings(processedRankings);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  //  ---------- RENDER RANKING COMPONENT -------------
  const renderRankingList = (rankingData, categoryConfig) => {
    // Loading state
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="text-slate-300">Loading rankings...</p>
        </div>
      );
    }

    // Empty state
    if (!rankingData || rankingData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl text-yellow-400 font-bold mb-2">
            No Rankings Yet
          </h3>
          <p className="text-slate-300">
            Be the first to achieve a ranking in this category!
          </p>
        </div>
      );
    }

    // Rankings list
    return (
      <div className="space-y-4">
        {rankingData.map((rankUser, index) => {
          const isCurrentUser = rankUser.userId === user?.userId;

          return (
            <div
              key={rankUser.userId}
              className={`flex flex-col sm:flex-row border-2 gap-2 items-center justify-between p-2 sm:p-4 rounded-lg  
                ${
                  isCurrentUser
                    ? "bg-neutral-950 border-yellow-400"
                    : "bg-slate-900 border-indigo-400"
                }`}
            >
              <div className="flex px-2 py-4 sm:p-0 max-w-full items-center justify-around sm:justify-center gap-1 sm:gap-3">
                {/* Trophy */}
                <div className="mr-1">
                  {index < 3 ? (
                    <Trophy
                      size={32}
                      className={
                        index === 0
                          ? "text-yellow-400"
                          : index === 1
                          ? "text-gray-300"
                          : "text-orange-600"
                      }
                    />
                  ) : (
                    <span className="text-gray-400">#{index + 1}</span>
                  )}
                </div>
                {/* Profile Picture */}
                <ProfilePicture
                  userId={rankUser.userId}
                  username={rankUser.username}
                />
                <span
                  className={`text-base truncate ${
                    isCurrentUser ? "text-yellow-400 text-lg" : "text-white"
                  }`}
                >
                  {index + 1}. {rankUser.username}
                </span>
              </div>
              <div className="flex border-2 p-2 rounded-lg border-yellow-400 sm:border-none sm:rounded-none sm:p-0 items-center gap-2">
                {categoryConfig.icon}
                <span className="text-yellow-400">
                  {categoryConfig.formatScore(
                    rankUser[categoryConfig.scoreField]
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  //  ---------- RETURN JSX -------------
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center px-3 justify-center z-50">
      <div className="bg-gradient-to-b from-indigo-700 rounded-lg to-purple-800/90 shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-2">
          <div className="flex items-center px-2 justify-between">
            <div className="flex-grow text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl mt-4 text-slate-200 inline-block">
                Rankings
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-200 transition-colors hover:text-slate-300 text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="sm:p-6 p-3">
          {/* Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 p-1 rounded-lg mb-6">
            {Object.entries(Categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`p-1 rounded-lg border-2 transition-colors duration-200 ${
                  activeTab === key
                    ? "bg-blue-600 border-blue-400 text-slate-100"
                    : "bg-fuchsia-700 border-fuchsia-500 text-gray-400 hover:text-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  {category.icon}
                  <span className="text-xs sm:text-sm">{category.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4 p-2 sm:p-3 rounded-lg bg-indigo-600 overflow-y-auto max-h-[60vh]">
            {Object.entries(Categories).map(([key, category]) => (
              <div
                key={key}
                className={`${
                  activeTab === key ? "block max-h-screen" : "hidden"
                }`}
              >
                <div className="mb-4">
                  <h3 className="text-2xl sm:text-3xl my-2 text-center font-medium text-yellow-400">
                    {category.title}
                  </h3>
                  <p className="text-gray-200 text-center text-sm">
                    {category.description}
                  </p>
                </div>
                {renderRankingList(rankings[key], category)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

RankingsDisplay.propTypes = {
  onClose: PropTypes.func.isRequired,
};
