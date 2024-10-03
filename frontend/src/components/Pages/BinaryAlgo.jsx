import React from "react";

export default function BinaryAlgo() {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-icons">
          <a href="../index.html">
            <div title="Home">
              <img src="../data/images/home.png" alt="Home" />
            </div>
          </a>
          <div title="Reset Score" id="reset">
            <img src="../data/images/bin.png" alt="Reset" />
          </div>
          <div title="Hide Sidebar" className="hide-sidebar">
            <img src="../data/images/close.png" alt="Hide Sidebar" />
          </div>
        </div>

        <div className="sidebar-content">
          <h2 className="sidebar-title">BINARY MATH QUIZ</h2>
          <div className="sidebar-info"></div>
          <div className="sidebar-user-con">
            <div className="sidebar-user">
              <div>
                <img src="../data/images/user.png" alt="User" />
              </div>
              <span>johndoe123</span>
              <button className="log-out-btn">Log out</button>
            </div>
            <div className="coins">
              <div>
                <img src="../data/images/coin.gif" alt="Coins" />
              </div>
              <span className="coins-display"></span>
            </div>
          </div>

          <div
            className="sidebar-content-exercises exercises-container"
            data-category="Addition"
          >
            <div className="menu-title addition">Addition</div>
            <div className="exercises-wrapper">
              {[...Array(10).keys()].map((index) => (
                <div className="exercises" data-index={index} key={index}>
                  Exercise {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div
            className="sidebar-content-exercises exercises-container"
            data-category="Subtraction"
          >
            <div className="menu-title subtraction">Subtraction</div>
            <div className="exercises-wrapper">
              {[...Array(10).keys()].map((index) => (
                <div className="exercises" data-index={index} key={index}>
                  Exercise {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div
            className="sidebar-content-exercises exercises-container"
            data-category="Alphabet"
          >
            <div className="menu-title alphabet">Alphabet</div>
            <div className="exercises-wrapper">
              {[...Array(20).keys()].map((index) => (
                <div className="exercises" data-index={index} key={index}>
                  Exercise {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="top-bar">
          <div className="hamburger-menu">
            <img
              src="../data/images/hamburger.png"
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
                <br />- Show Answer: If you cannot answer a question, you can
                reveal the answer using the "Show Answer" button, which costs
                300 coins.
              </div>
            </div>

            <div className="button-container">
              <button className="show-button ex-area-btn show-btn">
                Show Answer (
                <div className="coin-show">
                  <img src="../data/images/coin.gif" alt="" />
                </div>
                <span>- 300)</span>
              </button>
            </div>
          </div>

          <div className="submit-answer">
            <button className="btn primary submit-answer-button">
              Submit Answer &gt;
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
