import React from "react";
import QuizForm from "./QuizForm";
const QuizControls = ({
  isBlurred,
  userAnswer,
  setUserAnswer,
  handleSubmitAnswer,
  handleShowAnswer,
  isQuizCompleted,
  formatTime,
  time,
  hasStarted,
  handleStart,
  handleAnswerChange,
}) => (
  <div className="flex flex-1 flex-col justify-center items-center">
    <div className="flex flex-col bg-gradient-to-br from-indigo-950 to-purple-950 p-8 border-2 border-purple-600 rounded-lg">
      <div className="flex justify-around items-center">
        <button
          disabled={hasStarted || isQuizCompleted}
          onClick={handleStart}
          className={`btn p-3 bg-gradient-to-r from-green-600 to-teal-600 text-slate-200 transition-colors hover:to-teal-500 hover:text-slate-100 ${
            isQuizCompleted || hasStarted ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          START
        </button>
        <div className="bg-zinc-950 border-2 border-slate-600 rounded-lg text-lg text-cyan-400 px-6 py-2">
          <span>Time:</span>{" "}
          <span className="tracking-widest">{formatTime()}</span>
        </div>
      </div>
      <QuizForm
        isBlurred={isBlurred}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        handleSubmitAnswer={handleSubmitAnswer}
        handleShowAnswer={handleShowAnswer}
        isQuizCompleted={isQuizCompleted}
        handleAnswerChange={handleAnswerChange}
      />
    </div>
  </div>
);

export default QuizControls;
