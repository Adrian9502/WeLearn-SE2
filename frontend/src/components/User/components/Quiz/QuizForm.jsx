import React from "react";

const QuizForm = ({
  isBlurred,
  userAnswer,
  setUserAnswer,
  handleSubmitAnswer,
  handleShowAnswer,
  isQuizCompleted,
  hasShownAnswer,
  handleAnswerChange,
}) => (
  <div className="my-6 flex gap-2 flex-col">
    <label htmlFor="answer" className="text-xl text-cyan-400">
      Answer:
    </label>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitAnswer();
      }}
      className="flex flex-col gap-10"
    >
      <textarea
        disabled={isBlurred || isQuizCompleted}
        value={userAnswer}
        onChange={handleAnswerChange}
        className="rounded-lg w-full max-w-full border-2 border-slate-600 text-cyan-400 bg-slate-950 jetbrains p-2 text-xl flex"
        placeholder="Type your answer here. If there are two or more answers, separate them with a comma (','), e.g., 'print, 12'."
        rows="4"
      />
      <div className="flex p-1 gap-5 justify-around">
        <button
          type="submit"
          disabled={isBlurred || isQuizCompleted}
          className="btn bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-800 transition-colors px-5 py-3 flex items-center justify-center uppercase text-yellow-400"
        >
          Submit Answer &gt;
        </button>
        <button
          className={`btn bg-gradient-to-r from-red-600 to-red-800 transition-colors px-4 py-3 flex items-center justify-center uppercase text-yellow-400 ${
            hasShownAnswer
              ? "opacity-50 cursor-not-allowed"
              : "hover:from-red-700 hover:to-red-800"
          }`}
          onClick={handleShowAnswer}
          disabled={isBlurred || isQuizCompleted || hasShownAnswer}
          type="button"
        >
          Show Answer{" "}
          <div className="ml-1 flex items-center">
            (<img src="/coin.gif" className="w-4 h-6" alt="coin" />
            <div>300</div>)
          </div>
        </button>
      </div>
    </form>
  </div>
);

export default QuizForm;
