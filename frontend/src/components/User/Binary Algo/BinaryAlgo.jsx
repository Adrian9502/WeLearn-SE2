import React, { useState, useEffect } from "react";
import BinaryAlgoSidebar from "./BinaryAlgoSidebar";
import Swal from "sweetalert2";

export default function BinaryAlgo() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [coins, setCoins] = useState(
    parseInt(localStorage.getItem("coins")) || 0
  );
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setUserAnswer("");
    setIsBlurred(true);
    setIsActive(false);
    setTime(0);
    setIsButtonDisabled(false);
    setIsQuizCompleted(false);
  };

  const handleShowAnswer = () => {
    Swal.fire({
      title: "Show Answer?",
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
      if (result.isConfirmed) {
        if (coins >= 300) {
          setUserAnswer(selectedQuiz.answer);
          const updatedCoins = coins - 300;
          setCoins(updatedCoins);
          localStorage.setItem("coins", updatedCoins.toString());
          Swal.fire({
            title: "Success!",
            text: `New Coins: ${updatedCoins}`,
            width: 500,
            padding: "1em",
            color: "#f00c45",
            background:
              "#fff url(https://i.pinimg.com/736x/82/cf/92/82cf92145d8c60f274c05401094ea998.jpg)",
            customClass: {
              popup: "swal-font",
              confirmButton: "btn-swal secondary",
            },
          });
        } else {
          Swal.fire({
            title: "Not enough coins!",
            text: `You need at least 300 coins to show answer. Coins: ${coins}`,
            width: 500,
            padding: "1em",
            color: "#f20c41",
            background:
              "#fff url(https://i.pinimg.com/736x/82/cf/92/82cf92145d8c60f274c05401094ea998.jpg)",
            customClass: {
              popup: "swal-font",
              confirmButton: "btn-swal secondary",
            },
          });
        }
      }
    });
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
        const cleanUserAnswer = userAnswer.trim().toLowerCase();
        const cleanCorrectAnswer = selectedQuiz.answer.trim().toLowerCase();

        console.log("User answer: ", cleanUserAnswer);
        console.log("Quiz answer: ", cleanCorrectAnswer);

        if (cleanUserAnswer === cleanCorrectAnswer) {
          Swal.fire({
            title: "Correct!",
            text: "You earned 100 coins!. Please choose another question on the sidebar!",
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
          if (selectedQuiz.onComplete) {
            selectedQuiz.onComplete();
            setIsQuizCompleted(true); // Mark this quiz as completed
            setIsButtonDisabled(true); // Disable buttons after completion
            setUserAnswer("");
            setIsBlurred(true);
            setTime(0);
            setIsActive(false);
          }
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

  const handleStart = () => {
    setIsActive(true);
    setIsBlurred(false);
    setTime(0);
    setIsButtonDisabled(true);
  };

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = () => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  return (
    <main
      style={{ fontFamily: "Retro Gaming, Arial, Helvetica, sans-serif" }}
      className="flex h-screen overflow-hidden"
    >
      <BinaryAlgoSidebar onQuizSelect={handleQuizSelect} />
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
                  <span className="font-bold">Identify the Placeholders:</span>
                  Look for the blanks represented by placeholders (e.g., _____).
                </p>
                <p>
                  <span className="font-bold">Answering:</span> If there are two
                  or more blanks, separate the answers with a comma
                  (&apos;,&apos;).
                </p>
                <p>
                  <span className="font-bold">Click Start:</span> To start the
                  game, click on &quot;Start&quot; and the timer will begin.
                  Good luck!
                </p>
              </div>

              <div className="exercise-area relative flex justify-around gap-5">
                <div>
                  <div className="text-slate-200 jetbrains mb-5">
                    <div className="font-bold text-lg mb-2">Instructions:</div>
                    <div className="font-semibold">
                      {selectedQuiz.instruction}
                    </div>
                  </div>
                  <div className="p-3 min-w-1/2 relative border-4 bg-neutral-900">
                    {/* Conditionally add/remove blur class based on isBlurred */}
                    <div className={isBlurred ? "blur" : ""} />
                    <pre className="jetbrains text-nowrap text-xl">
                      {selectedQuiz.question}
                    </pre>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-around">
                  {/* input and submit button */}
                  <div className="flex answer-container p-3 flex-col">
                    <div className="flex justify-around items-center">
                      <button
                        disabled={isButtonDisabled && isQuizCompleted} // Only disable if both conditions are true
                        onClick={handleStart}
                        className={`primary start-button ${
                          isButtonDisabled && isQuizCompleted
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      >
                        START
                      </button>
                      <div className="bg-zinc-950 text-lg text-cyan-400 px-6 py-1 timer">
                        <span>Time:</span>{" "}
                        <span className="tracking-widest">{formatTime()}</span>
                      </div>
                    </div>
                    <label
                      htmlFor="answer"
                      className="mb-1 mt-6 text-xl jetbrains text-cyan-400 font-bold"
                    >
                      Answer:
                    </label>

                    <form
                      className="flex gap-8"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmitAnswer();
                      }}
                    >
                      <input
                        type="text"
                        disabled={isBlurred || isQuizCompleted} // Disable input when quiz is completed
                        id="answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="answer-input jetbrains p-2 text-xl"
                        placeholder="Type your answer here..."
                      />
                      <button
                        type="submit"
                        disabled={isBlurred || isQuizCompleted} // Disable submit when quiz is completed
                        className="primary submit-answer-button"
                      >
                        Submit Answer &gt;
                      </button>
                    </form>
                  </div>

                  <button
                    className="ex-area-btn show-btn"
                    onClick={handleShowAnswer}
                    disabled={isBlurred || isQuizCompleted} // Disable show answer when quiz is completed
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
