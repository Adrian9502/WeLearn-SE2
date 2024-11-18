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
  <div className="flex flex-col 2xl:flex-row justify-between gap-6 px-2">
    <div
      className="py-4 sm:px-5 px-2 my-auto max-w-5xl rounded-lg bg-gradient-to-br border-2 from-slate-900 to-stone-950 border-purple-600 relative flex justify-center items-center"
      style={{ boxShadow: "1px 1px 10px 10px rgba(0,0,0,0.75)" }}
    >
      <div className="max-w-full">
        <div className="text-slate-200 mb-5">
          <div className="sm:text-lg mb-2">Instructions:</div>
          <div className="max-w-lg sm:max-w-3xl">
            {selectedQuiz.instruction}
          </div>
        </div>
        <div className="p-3 relative mx-auto border-4 rounded-lg border-slate-500 bg-neutral-900 overflow-hidden">
          {/* Added overflow-hidden */}
          <div className="isolate relative h-full">
            {/* Added h-full */}
            <div className="overflow-auto relative max-h-[300px] sm:max-h-none">
              {isBlurred && (
                <div className="absolute rounded-lg w-[90vh] sm:w-auto inset-0 z-10 bg-white/10 backdrop-blur-[5px]" />
              )}
              <pre className="jetbrains text-nowrap text-xl sm:text-2xl relative">
                {selectedQuiz.question}
              </pre>
            </div>
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
  hasShownAnswer: PropTypes.bool,
  handleAnswerChange: PropTypes.func.isRequired,
};
export default QuizInterface;
