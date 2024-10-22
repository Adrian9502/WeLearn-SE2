import React from "react";
import SortingAlgoSidebar from "./SortingAlgoSidebar";

export default function SortingAlgo() {
  return (
    <main
      style={{ fontFamily: "Retro Gaming, Arial, Helvetica, sans-serif" }}
      className="flex h-screen overflow-hidden"
    >
      <SortingAlgoSidebar />
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

        <div className="exercise">
          <h1 className="exercise-title">Choose an Exercise on the left!</h1>
          <p className="exercise-instruction">Good luck!</p>

          <div className="exercise-area">
            <div className="exercise-placeholder">
              <div className="instructions">
                Instructions: <br />
                1. Choose a Topic: Click on a topic in the left sidebar. <br />
                2. Select an Exercise: Click on an exercise title to reveal its
                questions.
                <br />
                3. Answer Questions: Fill in the blanks in each question with
                your responses.
                <br />
                4. Submit Your Answers: Click "Submit Answer" at the bottom
                after answering all questions.
                <br />
                <br />
                Additional Information: <br />
                - Correct Answer: You will earn 100 coins for each correct
                answer.
                <br />
                - Show Answer: If you cannot answer a question, you can reveal
                the answer using <br />
                the "Show Answer" button, which costs 300 coins.
              </div>
            </div>

            <div className="button-container">
              <button className="show-button ex-area-btn show-btn">
                Show Answer (
                <div className="coin-show">
                  <img src="/coin.gif" alt="coin" />
                </div>
                <span>- 300)</span>
              </button>
            </div>
          </div>

          <div className="submit-answer">
            <button className="ex-area-btn primary submit-answer-button">
              Submit Answer &gt;
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
