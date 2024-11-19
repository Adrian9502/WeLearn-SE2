import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import PropTypes from "prop-types";
import { FiRefreshCcw as RefreshCcw } from "react-icons/fi";
import {
  LuArrowUpAZ as ArrowUpAZ,
  LuArrowDownAZ as ArrowDownAZ,
} from "react-icons/lu";

export default function ProgressDisplay({ userProgress, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProgress, setFilteredProgress] = useState(userProgress || []);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });

  // SEARCH ALGORITHM
  const searchProgress = (term) => {
    if (!Array.isArray(userProgress)) return []; // Prevent error if userProgress is not an array
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
        case "completed":
          compareA = a.completed ? 1 : 0;
          compareB = b.completed ? 1 : 0;
          return direction === "asc"
            ? compareA - compareB
            : compareB - compareA;
        case "unanswered":
          compareA = a.completed ? 0 : 1;
          compareB = b.completed ? 0 : 1;
          return direction === "asc"
            ? compareA - compareB
            : compareB - compareA;
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
    setFilteredProgress(userProgress || []);
  };

  // Update filtered progress whenever search term, userProgress, or sort config changes
  useEffect(() => {
    if (!Array.isArray(userProgress)) return; // Ensure userProgress is an array
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

  if (!Array.isArray(userProgress)) {
    return null; // Return null or a fallback if userProgress is invalid
  }

  return (
    <div className="left-0 right-0 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br btn from-indigo-700 to-violet-800/90 rounded-lg p-6 max-w-4xl min-h-[80vh] max-h-[80vh] overflow-y-auto relative w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-200 hover:text-slate-300"
        >
          ✕
        </button>

        <h3 className="text-center mb-3 sm:mb-5 text-yellow-400 text-2xl sm:text-3xl md:text-4xl">
          Your Progress
        </h3>

        {userProgress.length > 0 ? (
          <div className="sm:p-2">
            {/* Search, Stats and Controls */}
            <div className="mb-6">
              {/* Search Bar with Pixel Border */}
              <div className="relative mb-3 sm:mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 sm:p-3 bg-slate-200 text-slate-900 btn"
                  />
                  <IoIosSearch
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-900"
                    size={24}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4">
                {[
                  { key: "title", label: "Title" },
                  { key: "attempts", label: "Attempts" },
                  { key: "time", label: "Time" },
                ].map((sort) => (
                  <button
                    key={sort.key}
                    onClick={() => handleSort(sort.key)}
                    className="sm:px-4 px-2 text-slate-200 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 py-1.5 btn rounded-lg transition-all flex items-center gap-2"
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
                  onClick={() => handleSort("completed")}
                  className="sm:px-4 px-2 btn text-slate-200 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 py-1.5 rounded-lg transition-all flex items-center gap-2"
                >
                  Completed
                  {sortConfig.key === "completed" &&
                    (sortConfig.direction === "desc" ? (
                      <ArrowDownAZ size={16} />
                    ) : (
                      <ArrowUpAZ size={16} />
                    ))}
                </button>

                <button
                  onClick={() => handleSort("unanswered")}
                  className="sm:px-4 px-2 text-slate-200 py-1.5 btn bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 rounded-lg transition-all flex items-center gap-2"
                >
                  Unanswered
                  {sortConfig.key === "unanswered" &&
                    (sortConfig.direction === "desc" ? (
                      <ArrowDownAZ size={16} />
                    ) : (
                      <ArrowUpAZ size={16} />
                    ))}
                </button>

                <button
                  onClick={handleReset}
                  className="sm:px-4 px-2 text-slate-200 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 py-1.5 btn rounded-lg transition-all flex items-center gap-2"
                >
                  <RefreshCcw size={16} /> Reset
                </button>
              </div>

              {/* Stats */}
              <div className="text-slate-200 text-center sm:text-start text-sm px-2">
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
              <div className="text-center truncate text-gray-200 py-8 border-4 border-dashed border-rose-600">
                No quizzes found matching <br /> &quot;{searchTerm}&quot;
              </div>
            )}

            {/* Quiz Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProgress.map((quiz) => (
                <div
                  key={quiz._id}
                  className={`relative p-3 sm:p-4 ${
                    quiz.completed ? "bg-fuchsia-600" : "bg-gray-800"
                  } rounded-lg shadow-lg overflow-hidden border-4 border-yellow-500`}
                >
                  {/* Title */}
                  <h4 className="text-white mb-4 text-center px-4 py-1 sm:py-2 bg-blue-700 border-b-4 border-blue-900 font-mono text-xl tracking-wider">
                    {quiz.quizId.title}
                  </h4>

                  {/* Stats Boxes */}
                  <div className="space-y-2 sm:space-y-4">
                    <div className="bg-blue-700 p-2 sm:p-4 border-4 border-blue-900 rounded-lg shadow-lg">
                      <div className="text-xs text-gray-100  mb-1 uppercase pixel-font">
                        Total Attempts
                      </div>
                      <div className="text-xl sm:text-3xl text-yellow-400 text-center font-mono">
                        {quiz.exercisesCompleted}
                      </div>
                    </div>

                    <div className="bg-blue-700 p-2 sm:p-4 border-4 border-blue-900 rounded-lg shadow-lg">
                      <div className="text-xs text-gray-100 mb-1 uppercase pixel-font">
                        Time Spent
                      </div>
                      <div className="text-xl sm:text-3xl text-yellow-400 text-center font-mono">
                        {formatTimeSpent(quiz.totalTimeSpent)}
                      </div>
                    </div>
                    <div
                      className={`p-1 border-4  rounded-lg shadow-lg ${
                        quiz.completed
                          ? "bg-green-700  border-green-900"
                          : "bg-red-700  border-red-900"
                      }`}
                    >
                      <div className="text-base text-slate-100 text-center font-medium font-mono">
                        {quiz.completed ? "Completed ✔" : "Unanswered ✖"}
                      </div>
                    </div>
                    <div className="text-slate-200 text-xs">
                      {new Date(quiz.lastAttemptDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}{" "}
                      at{" "}
                      {new Date(quiz.lastAttemptDate).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8 border-4 border-dashed border-rose-600">
            No progress data available
          </div>
        )}
      </div>
    </div>
  );
}

ProgressDisplay.propTypes = {
  userProgress: PropTypes.array,
  onClose: PropTypes.func.isRequired,
};
