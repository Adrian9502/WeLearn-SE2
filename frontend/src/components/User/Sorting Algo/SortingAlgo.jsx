import React, { useState } from "react";
import SortingAlgoSidebar from "./SortingAlgoSidebar";

export default function SortingAlgo() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [coins, setCoins] = useState(
    parseInt(localStorage.getItem("coins")) || 0
  );

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setUserAnswer("");
    console.log(selectedQuiz);
  };

  const handleShowAnswer = () => {
    if (coins >= 300) {
      setUserAnswer(selectedQuiz.answer);
      setCoins(coins - 300);
      localStorage.setItem("coins", (coins - 300).toString());
    } else {
      alert("Not enough coins!");
    }
  };

  const handleSubmitAnswer = () => {
    if (userAnswer.trim().toLowerCase() === selectedQuiz.answer.toLowerCase()) {
      alert("Correct answer! You earned 100 coins!");
      setCoins(coins + 100);
      localStorage.setItem("coins", (coins + 100).toString());
    } else {
      alert("Incorrect answer. Try again!");
    }
  };

  return (
    <main
      style={{ fontFamily: "Retro Gaming, Arial, Helvetica, sans-serif" }}
      className="flex h-screen overflow-hidden"
    >
      <SortingAlgoSidebar onQuizSelect={handleQuizSelect} />
      <div className="main-content">
        <div className="top-bar">
          <div className="hamburger-menu">
            <img
              src="/hamburger.png"
              id="hamburger"
              title="Show sidebar"
              alt="hamburger"
            />
          </div>
        </div>

        <div className="exercise w-full bg-black">
          {selectedQuiz ? (
            <>
              <h1 className="exercise-title">{selectedQuiz.title}</h1>
              <p className="exercise-instruction">{selectedQuiz.instruction}</p>

              <div className="exercise-area">
                <div className="bg-red-400">
                  <pre className="jetbrains question-code">
                    {selectedQuiz.question}
                  </pre>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="answer-input p-2 border rounded"
                    placeholder="Type your answer here..."
                  />
                </div>

                <div className="button-container">
                  <button
                    className="show-button ex-area-btn show-btn"
                    onClick={handleShowAnswer}
                  >
                    Show Answer (
                    <div className="coin-show">
                      <img src="/coin.gif" alt="coin" />
                    </div>
                    <span>- 300)</span>
                  </button>
                </div>
              </div>

              <div className="submit-answer">
                <button
                  className="ex-area-btn primary submit-answer-button"
                  onClick={handleSubmitAnswer}
                >
                  Submit Answer &gt;
                </button>
              </div>
            </>
          ) : (
            // Original placeholder content when no quiz is selected
            <>
              <h1 className="exercise-title">
                Choose an Exercise on the left!
              </h1>
              <p className="exercise-instruction">Good luck!</p>
              <div className="exercise-area">
                <div className="exercise-placeholder">
                  <div className="instructions">
                    Instructions: <br />
                    1. Choose a Topic: Click on a topic in the left sidebar.{" "}
                    <br />
                    2. Select an Exercise: Click on an exercise title to reveal
                    itsquestions.
                    <br />
                    3. Answer Questions: Fill in the blanks in each question
                    withyour responses.
                    <br />
                    4. Submit Your Answers: Click "Submit Answer" at the
                    bottomafter answering all questions.
                    <br />
                    <br />
                    Additional Information: <br />- Correct Answer: You will
                    earn 100 coins for each correctanswer.
                    <br />- Show Answer: If you cannot answer a question, you
                    can revealthe answer using <br />
                    the "Show Answer" button, which costs 300 coins.
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
