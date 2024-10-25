import React, { useState } from "react";
import SortingAlgoSidebar from "./SortingAlgoSidebar";
import Swal from "sweetalert2";
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
    Swal.fire({
      title: "Submit Answer?",
      width: 500,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
      cancelButtonText: "NO",
      padding: "1em",
      color: "#c3e602",
      background:
        "#fff url(https://cdn.vectorstock.com/i/1000v/38/53/pixel-art-style-purple-gradient-background-vector-8473853.jpg",
      customClass: {
        popup: "swal-font",
        confirmButton: "btn-swal primary",
        cancelButton: "btn-swal show-btn",
      },
    }).then((result) => {
      // Only proceed if the user confirms the submission
      if (result.isConfirmed) {
        if (
          userAnswer.trim().toLowerCase() === selectedQuiz.answer.toLowerCase()
        ) {
          Swal.fire({
            title: "Correct!",
            text: "You earned 100 coins!",
            width: 500,
            padding: "1em",
            color: "#ffea00",
            background:
              "#fff url(https://st4.depositphotos.com/18899402/24653/i/450/depositphotos_246531954-stock-photo-abstract-purple-blue-gradient-background.jpg)",
            backdrop: `
              rgba(0,0,123,0.4)
              url("/toothless-dancing.gif")
              left top
              no-repeat
            `,
            customClass: {
              popup: "swal-font",
              confirmButton: "btn-swal primary",
            },
          });

          // Update coins in state and localStorage
          const newCoins = coins + 100;
          setCoins(newCoins);
          localStorage.setItem("coins", newCoins.toString());
        } else {
          Swal.fire({
            title: "Wrong answer!",
            text: "That's okay, Try again!",
            width: 500,
            padding: "1em",
            color: "#f00c45",
            background:
              "#fff url(https://i.pinimg.com/736x/82/cf/92/82cf92145d8c60f274c05401094ea998.jpg)",
            backdrop: `
              rgba(0,0,123,0.4)
              url("/cute-sad.gif")
              left top
              no-repeat
            `,
            customClass: {
              popup: "swal-font",
              confirmButton: "btn-swal secondary",
            },
          });
        }
      }
    });
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

        <div className="exercise w-full">
          {selectedQuiz ? (
            <>
              <h1 className="exercise-title">{selectedQuiz.title}</h1>
              <div className="exercise-instruction jetbrains">
                <p>
                  <span className="font-bold">Review the Code:</span> Read
                  through the given code snippets carefully.
                </p>
                <p>
                  <span className="font-bold">Identify the Placeholders:</span>{" "}
                  Look for the blanks represented by placeholders (e.g., _____).
                </p>
                <p>
                  <span className="font-bold">Relax:</span> Take time to analyze
                  the provided code below.
                </p>
              </div>

              <div className="exercise-area flex gap-5">
                <div className="min-w-1/2">
                  <div className="text-slate-200 jetbrains  mb-5">
                    <div className="font-bold text-lg mb-2">Instructions:</div>
                    <div className="font-semibold">
                      {selectedQuiz.instruction}
                    </div>
                  </div>
                  <div className="p-3 border-4 bg-neutral-900">
                    <pre className="jetbrains text-nowrap text-xl">
                      {selectedQuiz.question}
                    </pre>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-around">
                  {/* input and submit button */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="answer"
                      className="mb-5 text-xl jetbrains text-cyan-500 font-bold"
                    >
                      Answer:
                    </label>
                    <div className="flex gap-8">
                      <input
                        type="text"
                        id="answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="answer-input jetbrains p-2 text-xl"
                        placeholder="Type your answer here..."
                      />
                      <button
                        className="ex-area-btn primary submit-answer-button"
                        onClick={handleSubmitAnswer}
                      >
                        Submit Answer &gt;
                      </button>
                    </div>
                  </div>

                  <button
                    className="ex-area-btn show-btn"
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
            </>
          ) : (
            // Original placeholder content when no quiz is selected
            <>
              <h1 className="exercise-title">
                Choose an Exercise on the left!
              </h1>
              <p className="exercise-instruction">Good luck!</p>
              <div className="exercise-area">
                <div>
                  <div className="instructions jetbrains">
                    Instructions: <br />
                    1. Choose a Topic: Click on a topic in the left sidebar.{" "}
                    <br />
                    2. Select an Exercise: Click on an exercise title to reveal
                    its questions.
                    <br />
                    3. Answer Questions: Fill in the blanks in each question wit
                    hyour responses.
                    <br />
                    4. Submit Your Answers: Click &quot;Submit Answer&quot; at
                    the bottom after answering all questions.
                    <br />
                    <br />
                    Additional Information: <br />- Correct Answer: You will
                    earn 100 coins for each correct answer.
                    <br />- Show Answer: If you cannot answer a question, you
                    can reveal the answer using <br />
                    the &quot;Show Answer&quot; button, which costs 300 coins.
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
