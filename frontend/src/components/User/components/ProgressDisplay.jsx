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
      <div className="bg-slate-900 rounded-lg p-6 max-w-4xl min-h-[80vh] max-h-[80vh] overflow-y-auto relative w-full mx-4">
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
}
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
