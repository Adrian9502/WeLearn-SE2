import React from "react";
import QuizControls from "./QuizControls";
import PropTypes from "prop-types";

const QuizInterface = ({
  selectedQuiz,
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
  hasShownAnswer,
  handleAnswerChange,
}) => (
  <div className="flex justify-between gap-6 px-2">
    <div
      className="py-4 px-5 w-fit h-fit my-auto max-w-5xl rounded-lg bg-gradient-to-br border-2 from-slate-900 to-stone-950 border-purple-600 relative flex justify-center items-center"
      style={{ boxShadow: "1px 1px 10px 10px rgba(0,0,0,0.75)" }}
    >
      <div className="max-w-full">
        <div className="text-slate-200 mb-5">
          <div className="text-lg mb-2">Instructions:</div>
          <div className="max-w-3xl">{selectedQuiz.instruction}</div>
        </div>
        <div className="p-3 w-fit mx-auto border-4 rounded-lg border-slate-500 relative bg-neutral-900">
          <div className={isBlurred ? "blur" : ""} />
          <pre className="jetbrains text-nowrap text-2xl">
            {selectedQuiz.question}
          </pre>
        </div>
      </div>
    </div>
    <QuizControls
      isBlurred={isBlurred}
      userAnswer={userAnswer}
      setUserAnswer={setUserAnswer}
      handleSubmitAnswer={handleSubmitAnswer}
      handleShowAnswer={handleShowAnswer}
      isQuizCompleted={isQuizCompleted}
      formatTime={formatTime}
      time={time}
      hasStarted={hasStarted}
      handleStart={handleStart}
      hasShownAnswer={hasShownAnswer}
      handleAnswerChange={handleAnswerChange}
    />
  </div>
);

QuizInterface.propTypes = {
  selectedQuiz: PropTypes.shape({
    instruction: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
  }).isRequired,
  isBlurred: PropTypes.bool.isRequired,
  userAnswer: PropTypes.string.isRequired,
  setUserAnswer: PropTypes.func.isRequired,
  handleSubmitAnswer: PropTypes.func.isRequired,
  handleShowAnswer: PropTypes.func.isRequired,
  isQuizCompleted: PropTypes.bool.isRequired,
  formatTime: PropTypes.func.isRequired,
  time: PropTypes.number.isRequired,
  hasStarted: PropTypes.bool.isRequired,
  handleStart: PropTypes.func.isRequired,
  hasShownAnswer: PropTypes.bool.isRequired,
  handleAnswerChange: PropTypes.func.isRequired,
};
export default QuizInterface;
