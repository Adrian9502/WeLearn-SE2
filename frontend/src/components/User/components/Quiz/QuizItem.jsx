import React from "react";
import PropTypes from "prop-types";

export default function QuizItem({
  quiz,
  onClick,
  userProgress,
  completedQuizzes,
}) {
  const isCompleted =
    userProgress?.some(
      (progress) => progress.quizId._id === quiz._id && progress.completed
    ) || completedQuizzes?.has(quiz._id);

  return (
    <div
      data-quiz-id={quiz._id}
      onClick={isCompleted ? undefined : onClick}
      className={`
          relative btn bg-gradient-to-r overflow-hidden rounded-lg
          ${
            isCompleted
              ? "from-green-600 to-emerald-700 cursor-not-allowed"
              : "from-red-600 to-red-700 cursor-pointer"
          }
          transform transition-all duration-200
          sm:py-3 sm:px-2 p-2 shadow-lg`}
    >
      <div className="flex justify-center gap-1 items-center">
        <span className="text-white">{quiz.title}</span>
        {isCompleted && (
          <div className="flex items-center">
            <div className="sm:w-4 sm:h-4 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}

QuizItem.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  userProgress: PropTypes.arrayOf(
    PropTypes.shape({
      quizId: PropTypes.shape({
        _id: PropTypes.string,
      }).isRequired,
      completed: PropTypes.bool.isRequired,
    })
  ),
  completedQuizzes: PropTypes.instanceOf(Set),
};
