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
  <div className="flex flex-col 2xl:flex-row pb-5 justify-between gap-6 px-2">
    <div
      className="py-4 sm:px-5 px-2 my-auto max-h-[75vh] w-full max-w-5xl rounded-lg bg-gradient-to-br border-2 from-slate-900 to-stone-950 border-purple-600 relative"
      style={{ boxShadow: "1px 1px 10px 10px rgba(0,0,0,0.75)" }}
    >
      <div className="h-full flex flex-col">
        <div className="text-slate-200 mb-5">
          <div className="sm:text-lg mb-2">Instructions:</div>
          <div className="max-w-lg sm:max-w-3xl text-lg">
            {selectedQuiz.instructions}
          </div>
        </div>
        <div className="flex-grow max-h-[60vh] overflow-auto p-3 relative border-4 rounded-lg border-slate-500 bg-neutral-900">
          <div className="relative h-full">
            {isBlurred && (
              <div className="absolute rounded-lg inset-0 z-10 bg-white/10 backdrop-blur-[5px]" />
            )}
            <pre className="jetbrains text-nowrap text-xl sm:text-2xl overflow-auto">
              {selectedQuiz.questions}
            </pre>
          </div>
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
    instructions: PropTypes.string.isRequired,
    questions: PropTypes.string.isRequired,
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
  hasShownAnswer: PropTypes.bool,
  handleAnswerChange: PropTypes.func.isRequired,
};
export default QuizInterface;
