import React, { useState, useEffect } from "react";
import {
  FaTrophy as Trophy,
  FaClock as Clock,
  FaCoins as Coins,
} from "react-icons/fa";
import { GiTargeting as Target } from "react-icons/gi";
import { MdEmojiEvents as Award } from "react-icons/md";
import { IoFlash as Zap } from "react-icons/io5";

export default function RankingsDisplay({ onClose }) {
  const [rankings, setRankings] = useState({
    quizCompletion: [],
    speedsters: [],
    wealthiest: [],
    consistent: [],
    efficiency: [],
  });
  const [activeTab, setActiveTab] = useState("quizCompletion");

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

  const renderRankingList = (rankingData, categoryConfig) => {
    return (
      <div className="space-y-4">
        {rankingData.map((user, index) => (
          <div
            key={user.userId}
            className="flex items-center justify-between p-4 bg-gray-800 btn-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 text-center">
                {index < 3 ? (
                  <Trophy
                    size={24}
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
              <span className="text-white">
                {index + 1}. {user.username}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {categoryConfig.icon}
              <span className="text-yellow-400">
                {categoryConfig.formatScore(user[categoryConfig.scoreField])}
              </span>
            </div>
          </div>
        ))}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="user-completed-quiz-container shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex-grow text-center">
              <h2 className="text-3xl mt-4 font-bold text-cyan-400 inline-block">
                Rankings
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-200 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tabs */}
          <div className="grid grid-cols-5 gap-4 p-1 rounded-lg mb-6">
            {Object.entries(rankingCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`p-1 btn-border transition-colors duration-200 ${
                  activeTab === key
                    ? "bg-blue-600 text-white"
                    : "bg-fuchsia-700 text-gray-300 hover:text-gray-200"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  {category.icon}
                  <span className="text-sm">{category.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4 p-3 btn-border bg-blue-700 overflow-y-auto">
            {Object.entries(rankingCategories).map(([key, category]) => (
              <div
                key={key}
                className={`${activeTab === key ? "block" : "hidden"}`}
              >
                <div className="mb-4">
                  <h3 className="text-2xl text-center font-medium text-yellow-500">
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
