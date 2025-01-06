import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const QuizForm = ({
  isBlurred,
  userAnswer,
  handleSubmitAnswer,
  handleShowAnswer,
  isQuizCompleted,
  hasShownAnswer,
  handleAnswerChange,
}) => {
  return (
    <div className="my-6 flex gap-2 flex-col">
      <label htmlFor="answer" className="sm:text-xl text-cyan-400">
        Answer:
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitAnswer();
        }}
        className="flex flex-col gap-5 sm:gap-10"
      >
        <textarea
          disabled={isBlurred || isQuizCompleted}
          value={userAnswer}
          onChange={handleAnswerChange}
          className="rounded-lg w-full max-w-full border-2 border-slate-600 text-cyan-400 bg-slate-950 jetbrains p-2 text-xl flex"
          placeholder="Type your answer here. If there are two or more answers, separate them with a comma (','), e.g., 'print, 12'."
          rows="4"
        />
        <div className="flex flex-col sm:flex-row p-1 gap-5 justify-around">
          <button
            type="submit"
            disabled={isBlurred || isQuizCompleted}
            className="btn bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-800 transition-colors px-5 py-3 flex items-center justify-center uppercase text-yellow-400"
          >
            Submit Answer &gt;
          </button>
          <button
            className={`btn text-sm bg-gradient-to-r from-red-600 to-red-800 transition-colors py-3 px-6 flex gap-1 flex-row sm:flex-col items-center justify-center uppercase text-yellow-400 ${
              hasShownAnswer
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-red-700 hover:to-red-800"
            }`}
            onClick={handleShowAnswer}
            disabled={isBlurred || isQuizCompleted || hasShownAnswer}
            type="button"
          >
            <span>Show Answer</span>
            <div className="flex text-sm items-center">
              (<img src="/coin.gif" className="w-4 h-5" alt="coin" />
              <div>-300</div>)
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};
QuizForm.propTypes = {
  isBlurred: PropTypes.bool.isRequired,
  userAnswer: PropTypes.string.isRequired,
  setUserAnswer: PropTypes.func.isRequired,
  handleSubmitAnswer: PropTypes.func.isRequired,
  handleShowAnswer: PropTypes.func.isRequired,
  isQuizCompleted: PropTypes.bool.isRequired,
  hasShownAnswer: PropTypes.bool,
  handleAnswerChange: PropTypes.func.isRequired,
};
export default QuizForm;
