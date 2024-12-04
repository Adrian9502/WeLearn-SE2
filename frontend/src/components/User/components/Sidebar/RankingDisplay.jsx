import React, { useState, useEffect } from "react";
import {
  FaTrophy as Trophy,
  FaClock as Clock,
  FaCoins as Coins,
  FaUserCircle as DefaultProfile,
} from "react-icons/fa";
import { GiTargeting as Target } from "react-icons/gi";
import { MdEmojiEvents as Award } from "react-icons/md";
import { IoFlash as Zap } from "react-icons/io5";
import { useUser } from "../../UserContext";

export default function RankingsDisplay({ onClose }) {
  const [rankings, setRankings] = useState({
    quizCompletion: [],
    speedsters: [],
    wealthiest: [],
    consistent: [],
    efficiency: [],
  });
  const [activeTab, setActiveTab] = useState("quizCompletion");
  const { user } = useUser();
  useEffect(() => {
    const fetchRankings = async () => {
      try {
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
      }
    };

    fetchRankings();
  }, []);
  // GET PROFILE PICTURE OF EACH USER
  const ProfilePicture = ({ userId, username }) => {
    const [imgError, setImgError] = useState(false);

    if (imgError) {
      return (
        <div className="rounded-full w-10 h-10 overflow-hidden">
          <img
            src={`/default-profile.png`}
            className="w-10 h-10 object-cover"
          />
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
  };

  const renderRankingList = (rankingData, categoryConfig) => {
    const placeholderRankings =
      rankingData.length === 0
        ? [
            {
              userId: "placeholder1",
              username: "- - - - - -",
              [categoryConfig.scoreField]: 0,
            },
            {
              userId: "placeholder2",
              username: "- - - - - -",
              [categoryConfig.scoreField]: 0,
            },
            {
              userId: "placeholder3",
              username: "- - - - - -",
              [categoryConfig.scoreField]: 0,
            },
          ]
        : rankingData;
    return (
      <div className="space-y-4">
        {placeholderRankings.map((rankUser, index) => {
          const isPlaceholder = rankUser.userId.startsWith("placeholder");
          const isCurrentUser =
            !isPlaceholder && rankUser.userId === user?.userId;

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

  const rankingCategories = {
    quizCompletion: {
      title: "Quiz Masters",
      description: "Players who completed the most quizzes",
      icon: <Target className="text-green-400" size={20} />,
      scoreField: "completedQuizzes",
      formatScore: (score) => `${score} quizzes`,
    },
    speedsters: {
      title: "Speed Demons",
      description: "Fastest quiz completers",
      icon: <Zap className="text-blue-400" size={20} />,
      scoreField: "averageTime",
      formatScore: (time) => `${time.toFixed(1)}s avg`,
    },
    wealthiest: {
      title: "Coin Champions",
      description: "Players with the most coins",
      icon: <Coins className="text-yellow-400" size={20} />,
      scoreField: "coins",
      formatScore: (coins) => `${coins} coins`,
    },
    consistent: {
      title: "Consistency Kings",
      description: "Most regular players",
      icon: <Award className="text-purple-400" size={20} />,
      scoreField: "consecutiveDays",
      formatScore: (days) => `${days} days`,
    },
    efficiency: {
      title: "Efficiency Elite",
      description: "Highest success rate",
      icon: <Clock className="text-red-400" size={20} />,
      scoreField: "successRate",
      formatScore: (rate) => `${(rate * 100).toFixed(1)}%`,
    },
  };

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
            {Object.entries(rankingCategories).map(([key, category]) => (
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
            {Object.entries(rankingCategories).map(([key, category]) => (
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
