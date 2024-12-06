import React from "react";
import PropTypes from "prop-types";
import formatTimeSpent from "./formatTimeSpent";

export default function QuizProgressCard({ quiz }) {
  return (
    <div
      key={quiz.quizId._id}
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
          <div className="text-xs text-gray-100 mb-1 uppercase pixel-font">
            Total Attempts
          </div>
          <div className="text-xl sm:text-3xl text-yellow-400 text-center font-mono">
            {quiz.exercisesCompleted || 0}
          </div>
        </div>

        <div className="bg-blue-700 p-2 sm:p-4 border-4 border-blue-900 rounded-lg shadow-lg">
          <div className="text-xs text-gray-100 mb-1 uppercase pixel-font">
            Time Spent
          </div>
          <div className="text-xl sm:text-3xl text-yellow-400 text-center font-mono">
            {formatTimeSpent(quiz.totalTimeSpent || 0)}
          </div>
        </div>
        <div
          className={`p-1 border-4 rounded-lg shadow-lg ${
            quiz.completed
              ? "bg-green-700 border-green-900"
              : "bg-red-700 border-red-900"
          }`}
        >
          <div className="text-base text-slate-100 text-center font-medium font-mono">
            {quiz.completed ? "Completed ✔" : "Unanswered ✖"}
          </div>
        </div>
        <div className="text-slate-200 text-xs">
          {quiz.lastAttemptDate
            ? new Date(quiz.lastAttemptDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "No attempts yet"}{" "}
          {quiz.lastAttemptDate && (
            <>
              at{" "}
              {new Date(quiz.lastAttemptDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

QuizProgressCard.propTypes = {
  quiz: PropTypes.shape({
    quizId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    exercisesCompleted: PropTypes.number,
    totalTimeSpent: PropTypes.number,
    completed: PropTypes.bool,
    lastAttemptDate: PropTypes.string,
  }).isRequired,
};
