import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "./UserContext";
import { IoIosSearch } from "react-icons/io";
import { FaTrophy, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import { FiRefreshCcw as RefreshCcw } from "react-icons/fi";
import {
  LuArrowUpAZ as ArrowUpAZ,
  LuArrowDownAZ as ArrowDownAZ,
} from "react-icons/lu";

import {
  FaTrophy as Trophy,
  FaClock as Clock,
  FaCoins as Coins,
} from "react-icons/fa";
import { GiTargeting as Target } from "react-icons/gi";
import { MdEmojiEvents as Award } from "react-icons/md";
import { IoFlash as Zap } from "react-icons/io5";

// Constants
const QUIZ_TYPES = {
  BUBBLE: "bubble",
  MERGE: "merge",
  INSERTION: "insertion",
  SELECTION: "selection",
  ADDITION: "addition",
  SUBTRACTION: "subtraction",
  ALPHABET: "alphabet",
};

const INITIAL_EXPANDED_STATE = {
  [QUIZ_TYPES.BUBBLE]: false,
  [QUIZ_TYPES.MERGE]: false,
  [QUIZ_TYPES.INSERTION]: false,
  [QUIZ_TYPES.SELECTION]: false,
  [QUIZ_TYPES.ADDITION]: false,
  [QUIZ_TYPES.SUBTRACTION]: false,
  [QUIZ_TYPES.ALPHABET]: false,
};
// Progress display component
const ProgressDisplay = ({ userProgress, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProgress, setFilteredProgress] = useState(userProgress);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });

  // SEARCH ALGORITHM
  const searchProgress = (term) => {
    const results = [];
    for (const quiz of userProgress) {
      if (quiz.quizId.title.toLowerCase().includes(term.toLowerCase())) {
        results.push(quiz);
      }
    }
    return results;
  };

  // Sort function
  const sortProgress = (data, key, direction) => {
    return [...data].sort((a, b) => {
      let compareA, compareB;

      switch (key) {
        case "title":
          compareA = a.quizId.title.toLowerCase();
          compareB = b.quizId.title.toLowerCase();
          return direction === "asc"
            ? compareA.localeCompare(compareB)
            : compareB.localeCompare(compareA);
        case "attempts":
          return direction === "asc"
            ? a.exercisesCompleted - b.exercisesCompleted
            : b.exercisesCompleted - a.exercisesCompleted;
        case "time":
          return direction === "asc"
            ? a.totalTimeSpent - b.totalTimeSpent
            : b.totalTimeSpent - a.totalTimeSpent;
        default:
          return 0;
      }
    });
  };

  // Handle sort
  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  // Reset all filters and sorting
  const handleReset = () => {
    setSearchTerm("");
    setSortConfig({ key: null, direction: "desc" });
    setFilteredProgress(userProgress);
  };

  // Update filtered progress whenever search term, userProgress, or sort config changes
  useEffect(() => {
    let filtered = searchProgress(searchTerm);
    if (sortConfig.key) {
      filtered = sortProgress(filtered, sortConfig.key, sortConfig.direction);
    }
    setFilteredProgress(filtered);
  }, [searchTerm, userProgress, sortConfig]);

  const formatTimeSpent = (totalTimeSpentInSeconds) => {
    if (totalTimeSpentInSeconds < 60) {
      return `${totalTimeSpentInSeconds} secs`;
    }
    const minutes = Math.floor(totalTimeSpentInSeconds / 60);
    const seconds = totalTimeSpentInSeconds % 60;
    return `${minutes} mins ${seconds} secs`;
  };

  if (!userProgress) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="user-completed-quiz-container p-6 max-w-4xl min-h-[80vh] max-h-[80vh] overflow-y-auto relative w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-600"
        >
          ✕
        </button>

        <h3 className="text-cyan-400 text-3xl text-center mb-5">
          Completed Quizzes
        </h3>

        {userProgress.length > 0 ? (
          <div className="p-2">
            {/* Search and Controls */}
            <div className="mb-8">
              {/* Search Bar with Pixel Border */}
              <div className="relative mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-800 text-white border-4 border-cyan-500 focus:border-cyan-400 outline-none 
                           [image-rendering:pixelated] transition-all
                           before:content-[''] before:absolute before:inset-0 before:border-4 before:border-black"
                  />
                  <IoIosSearch
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400"
                    size={24}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-4 mb-4">
                {[
                  { key: "title", label: "Title" },
                  { key: "attempts", label: "Attempts" },
                  { key: "time", label: "Time" },
                ].map((sort) => (
                  <button
                    key={sort.key}
                    onClick={() => handleSort(sort.key)}
                    className="px-2 bg-blue-700 text-white  transition-all progress-grid flex items-center gap-2"
                  >
                    {sort.label}
                    {sortConfig.key === sort.key &&
                      (sortConfig.direction === "desc" ? (
                        <ArrowDownAZ size={16} />
                      ) : (
                        <ArrowUpAZ size={16} />
                      ))}
                  </button>
                ))}
                <button
                  onClick={handleReset}
                  className="px-2 bg-blue-700 text-white  transition-all progress-grid flex items-center gap-2"
                >
                  <RefreshCcw size={16} /> Reset
                </button>
              </div>

              {/* Stats */}
              <div className="text-gray-400 text-sm px-2">
                Showing {filteredProgress.length} of {userProgress.length}{" "}
                quizzes
                {sortConfig.key && (
                  <span className="ml-2">
                    (Sorted by {sortConfig.key} -{" "}
                    {sortConfig.direction === "desc" ? "↓" : "↑"})
                  </span>
                )}
              </div>
            </div>

            {/* No Results */}
            {filteredProgress.length === 0 && (
              <div className="text-center text-gray-200 py-8 border-4 border-dashed border-rose-600">
                No quizzes found matching "{searchTerm}"
              </div>
            )}

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProgress.map((quiz) => (
                <div
                  key={quiz._id}
                  className={`
                 relative p-4 progress-grid
                 ${quiz.completed ? "bg-rose-600" : "bg-neutral-800"}
                 
              
               `}
                >
                  {/* Title */}
                  <h4 className="text-white text-xl mb-4 text-center px-2 py-1 bg-blue-600 border-b-4 border-blue-800">
                    {quiz.quizId.title}
                  </h4>

                  {/* Stats Boxes */}
                  <div className="space-y-4">
                    <div className="bg-blue-700 p-3 border-4 border-blue-900">
                      <div className="text-sm text-gray-200 mb-1">
                        Total Attempts
                      </div>
                      <div className="text-xl text-yellow-300 text-center">
                        {quiz.exercisesCompleted}
                      </div>
                    </div>

                    <div className="bg-blue-700 p-3 border-4 border-blue-900">
                      <div className="text-sm text-gray-200 mb-1">
                        Time Spent
                      </div>
                      <div className="text-xl text-yellow-300 text-center">
                        {formatTimeSpent(quiz.totalTimeSpent)}
                      </div>
                    </div>
                  </div>

                  {/* Last Attempt Date */}
                  <div className="mt-4 text-xs text-gray-200 border-t-2 border-yellow-500 pt-2">
                    Last Attempt:{" "}
                    {new Date(quiz.lastAttemptDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-slate-100 mt-10 text-lg">
            You currently don&quot;t have any progress. Go play now and start
            tracking your progress!
          </p>
        )}
      </div>
    </div>
  );
};
//  ranking component
const RankingsDisplay = ({ onClose }) => {
  const [rankings, setRankings] = useState({
    quizCompletion: [],
    speedsters: [],
    wealthiest: [],
    consistent: [],
    efficiency: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("quizCompletion");

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/progress/rankings"
        );
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
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-white">Loading rankings...</div>
      </div>
    );
  }

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
};
const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/quizzes");
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return quizzes;
};
// function to get user progress
const findQuizProgress = (quizId, userProgress) => {
  return userProgress?.find(
    (progress) => progress.quizId._id === quizId && progress.completed
  );
};
// Components
const UserInfo = ({ onLogout, username, coins, userProgress }) => {
  const [showProgress, setShowProgress] = useState(false);
  const [showRankings, setShowRankings] = useState(false);
  return (
    <div className="user-info-container relative px-4 py-2 my-8">
      {/* Pixel Border Container */}
      <div className="absolute inset-0 p-[2px]">
        <div className="absolute inset-0" style={{ margin: "2px" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Title with Pixel Effect */}
        <h1 className="text-center text-yellow-400 text-2xl mb-4 p-2 relative">
          <span className="absolute top-0 left-0 w-2 h-2 bg-yellow-400" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400" />
          <span className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-400" />
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-400" />
          PLAYER STATUS
        </h1>

        {/* User Profile Card */}
        <div className="user-con w-full max-w-xs flex flex-col items-center mb-4 btn-border p-4 relative">
          {/* Profile Image */}
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-lg p-[2px]">
              <div className="btn-border w-full h-full rounded-lg overflow-hidden">
                <img
                  src="/user-profile.png"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Username and Coins Section */}
          <div className="w-full px-4 py-3 bg-pink-700 btn-border">
            <div className="flex flex-col items-center border-b-2 border-yellow-500/30 pb-3 mb-3">
              <span className="jetbrains text-xs text-yellow-400/80">
                PLAYER NAME
              </span>
              <span className="text-lg text-white mt-1 truncate">
                {username}
              </span>
            </div>

            <div className="flex items-center justify-center">
              <span className="jetbrains text-xs text-yellow-400/80 mr-2">
                COINS
              </span>
              <div className="flex items-center bg-gray-500/20 px-3 py-1 rounded-full justify-center">
                <img src="/coin.gif" className="w-6 h-6 mr-1" alt="Coins" />
                <span className="text-lg text-slate-100">{coins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => setShowProgress(true)}
            className="btn-border view-progress-btn p-3 flex items-center justify-center gap-2 transition-all duration-200 text-white"
          >
            <FaChartLine className="text-lg" />
            <span>VIEW PROGRESS</span>
          </button>

          <button
            onClick={() => setShowRankings(true)}
            className="btn-border leaderboard-btn p-3 flex items-center justify-center gap-2 bg-gray-800 hover:bg-yellow-600 transition-all duration-200 text-white"
          >
            <FaTrophy className="text-lg" />
            <span>RANKINGS</span>
          </button>
          <div className="w-full border-b-2 border-yellow-500"></div>
          <button
            onClick={onLogout}
            className="btn-border log-out-btn p-3 flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-600 transition-all duration-200 text-white mt-2"
          >
            <FaSignOutAlt className="text-lg" />
            <span>LOG OUT</span>
          </button>
        </div>
      </div>

      {/* Progress Display */}
      {showProgress && (
        <ProgressDisplay
          userProgress={userProgress}
          onClose={() => setShowProgress(false)}
        />
      )}
      {/* ranking display */}
      {showRankings && (
        <RankingsDisplay onClose={() => setShowRankings(false)} />
      )}
    </div>
  );
};

// components
const SidebarIcons = () => (
  <div className="sidebar-icons">
    <Link to="/user-dashboard/home">
      <div title="Home">
        <img src="/home.png" alt="Home" />
      </div>
    </Link>
    <div title="Reset Score" id="reset">
      <img src="/bin.png" alt="Reset Score" />
    </div>
    <div title="Hide Sidebar" className="hide-sidebar">
      <img src="/close.png" alt="Hide Sidebar" />
    </div>
  </div>
);

const QuizItem = ({ quiz, onClick, userProgress, completedQuizzes }) => {
  const isCompleted =
    userProgress?.find(
      (progress) => progress.quizId._id === quiz._id && progress.completed
    ) || completedQuizzes?.has(quiz._id);

  return (
    <div
      data-quiz-id={quiz._id}
      onClick={onClick}
      className={`flex transition-colors exercises justify-between items-center p-2 ${
        isCompleted
          ? "bg-[#0fa002] hover:bg-[#128a07] pointer-events-none text-slate-100"
          : "bg-[#dd1d3d] hover:bg-[#a8122b] text-yellow-400"
      } `}
    >
      <span className="text-lg">{quiz.title}</span>
      {isCompleted && <span className="text-slate-200 text-xl ml-2">✓</span>}
    </div>
  );
};

const QuizSection = ({
  title,
  quizzes,
  isExpanded,
  onToggle,
  onQuizSelect,
  userProgress,
  completedQuizzes,
}) => {
  // Check if all quizzes in this section are completed
  const isSectionCompleted = () => {
    if (!quizzes || (!userProgress && !completedQuizzes)) return false;
    return quizzes.every(
      (quiz) =>
        findQuizProgress(quiz._id, userProgress) ||
        completedQuizzes?.has(quiz._id)
    );
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-center">
      <div
        className={`flex text-center items-center justify-between exercises w-full text-xl cursor-pointer transition-colors ${
          isSectionCompleted()
            ? "bg-[#0fa002] hover:bg-[#128a07]"
            : "bg-[#0110e6] hover:bg-[#020da7]"
        } text-slate-200 p-3 flex justify-between items-center`}
        onClick={() => onToggle(title.toLowerCase())}
      >
        <span>{title}</span>
        {isSectionCompleted() && <span className="text-white ext-2xl">✓</span>}
      </div>
      {isExpanded[title.toLowerCase()] && (
        <div className="flex border p-3 bg-[#0110e6] texture btn-border flex-col gap-5 mt-4">
          {quizzes?.map((quiz) => (
            <QuizItem
              key={quiz._id}
              quiz={quiz}
              onClick={() => onQuizSelect(quiz)}
              userProgress={userProgress}
              completedQuizzes={completedQuizzes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
export default function Sidebar({ onQuizSelect, userProgress }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(INITIAL_EXPANDED_STATE);
  const quizzes = useQuizzes();
  const { user } = useUser();
  const username = user?.username;
  const userId = user?.userId;

  const [userQuizCompleted, setUserQuizCompleted] = useState(null);

  // Function to fetch user count of completed quiz in quizzes
  const fetchUserQuizCompleted = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/progress/user/${userId}/summary`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the JSON from the response
      const data = await response.json();
      // Calculate the count of quizzes completed
      const completedQuizzesCount = data.quizzes.reduce((count, quiz) => {
        return quiz.completed ? count + 1 : count;
      }, 0);
      // Set the count of completed quizzes in state
      setUserQuizCompleted(completedQuizzesCount);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserQuizCompleted();
    }
  }, [userId]);

  const quizzesTitles = useMemo(
    () => [
      // sorting algorithm
      {
        sectionTitle: "Sorting Algorithms",
        quizzes: [
          {
            title: "Bubble Sort",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Bubble Sort")
            ),
          },
          {
            title: "Merge Sort",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Merge Sort")
            ),
          },
          {
            title: "Insertion Sort",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Insertion Sort")
            ),
          },
          {
            title: "Selection Sort",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Selection Sort")
            ),
          },
        ],
      },
      // binary operation
      {
        sectionTitle: "Binary Operation",
        quizzes: [
          {
            title: "Addition",
            quizzes: quizzes.filter((quiz) => quiz.title.includes("Addition")),
          },
          {
            title: "Subtraction",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Subtraction")
            ),
          },
          {
            title: "Alphabet",
            quizzes: quizzes.filter((quiz) => quiz.title.includes("Alphabet")),
          },
        ],
      },
    ],
    [quizzes]
  );
  // compute total quizzes
  const totalQuizzes = useMemo(
    () =>
      quizzesTitles.reduce(
        (total, section) =>
          total +
          section.quizzes.reduce(
            (subTotal, quizGroup) => subTotal + quizGroup.quizzes.length,
            0
          ),
        0
      ),
    [quizzesTitles]
  );
  const toggleQuizzes = useCallback((type) => {
    setIsExpanded((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  const handleQuizSelect = useCallback(
    (quiz) => {
      onQuizSelect(quiz);
    },
    [onQuizSelect]
  );

  const handleLogout = useCallback(() => {
    ["authToken", "userRole", "username", "coins", "userId"].forEach((key) =>
      localStorage.removeItem(key)
    );
    navigate("/");
  }, [navigate]);

  return (
    <aside className="sidebar min-h-screen overflow-auto">
      <SidebarIcons />

      <div className="sidebar-content">
        <h2 className="sidebar-title text-xl font-normal mt-5 p-2 text-center">
          Sorting Algorithm and <br /> Binary Operation
        </h2>

        <div className="sidebar-info mt-8 py-1 text-center text-base">
          Completed <br />
          <span className="text-2xl ">
            <span className="text-yellow-400">{userQuizCompleted} </span>
            <span className="text-xl">out of</span>
            <span className="text-yellow-400"> {totalQuizzes}</span>
          </span>
          <br />
          exercises
        </div>
        <UserInfo
          onLogout={handleLogout}
          username={username}
          coins={user?.coins || 0}
          userProgress={userProgress}
        />

        <div className="exercises-container">
          {quizzesTitles.map((section) => (
            <div className="quiz-container p-2 my-6" key={section.sectionTitle}>
              <h2 className="text-2xl text-center ">{section.sectionTitle}</h2>
              {section.quizzes.map((quiz) => (
                <QuizSection
                  key={quiz.title}
                  title={quiz.title}
                  quizzes={quiz.quizzes}
                  isExpanded={isExpanded}
                  onToggle={toggleQuizzes}
                  onQuizSelect={handleQuizSelect}
                  userProgress={userProgress}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Prop types
Sidebar.propTypes = {
  onQuizSelect: PropTypes.func.isRequired,
  userProgress: PropTypes.array,
  completedQuizzes: PropTypes.instanceOf(Set),
};

QuizItem.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  userProgress: PropTypes.arrayOf(
    PropTypes.shape({
      quizId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }),
      completed: PropTypes.bool.isRequired,
    })
  ),
};

QuizSection.propTypes = {
  title: PropTypes.string.isRequired,
  quizzes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  isExpanded: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onQuizSelect: PropTypes.func.isRequired,
  userProgress: PropTypes.arrayOf(
    PropTypes.shape({
      quizId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }),
      completed: PropTypes.bool.isRequired,
    })
  ),
};
ProgressDisplay.propTypes = {
  userProgress: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      quizId: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
      completed: PropTypes.bool.isRequired,
      exercisesCompleted: PropTypes.number.isRequired,
      totalTimeSpent: PropTypes.number.isRequired,
      lastAttemptDate: PropTypes.string.isRequired,
    })
  ),
  onClose: PropTypes.func.isRequired,
};
UserInfo.propTypes = {
  onLogout: PropTypes.func.isRequired,
  username: PropTypes.string,
  coins: PropTypes.number.isRequired,
  userProgress: PropTypes.array,
};
