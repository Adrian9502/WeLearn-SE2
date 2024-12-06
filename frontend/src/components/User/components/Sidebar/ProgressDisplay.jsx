import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import PropTypes from "prop-types";
import QuizProgressCard from "./Progress/QuizProgressCard";
import { FiRefreshCcw as RefreshCcw } from "react-icons/fi";
import {
  LuArrowUpAZ as ArrowUpAZ,
  LuArrowDownAZ as ArrowDownAZ,
} from "react-icons/lu";
import { useProgressSearch } from "./Progress/userProgressSearch";

export default function ProgressDisplay({ userProgress, onClose }) {
  // ----- CUSTOM HOOK -----
  const {
    searchTerm,
    setSearchTerm,
    filteredProgress,
    handleSort,
    handleReset,
    sortConfig,
  } = useProgressSearch(userProgress);

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
                  { key: "completed", label: "Completed" },
                  { key: "unanswered", label: "Unanswered" },
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
                <QuizProgressCard key={quiz.quizId._id} quiz={quiz} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8 border-4 border-dashed border-rose-600">
            You don&apos;t have progress yet. Play now to track your progress!
          </div>
        )}
      </div>
    </div>
  );
}
ProgressDisplay.propTypes = {
  userProgress: PropTypes.arrayOf(
    PropTypes.shape({
      quizId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }),
      exercisesCompleted: PropTypes.number,
      totalTimeSpent: PropTypes.number,
      completed: PropTypes.bool,
      lastAttemptDate: PropTypes.string,
    })
  ),
  onClose: PropTypes.func.isRequired,
};
