import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import TitleAndInstruction from "./components/TitleAndInstruction";
import Placeholder from "./components/Placeholder";
import { useUser } from "./UserContext";

export default function UserDashboard() {
  // ---- AUDIO -----
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  // ----------------------------------------------
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  // get user id and coins from context
  const { user, updateUser } = useUser();
  const userId = user?.userId;
  // Track time taken in quiz
  const [time, setTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  // -------------------------
  const [isActive, setIsActive] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  // --------- State for real time quiz completion tracking
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
  // Fetch user's progress when component mounts
  useEffect(() => {
    if (userId) {
      const fetchCompletedQuizzes = async () => {
        try {
          const response = await axios.get(
            `/api/progress/user/${userId}/summary`
          );
          const completed = new Set(
            response.data.quizzes
              .filter((quiz) => quiz.completed)
              .map((quiz) => quiz.quizId._id)
          );
          setCompletedQuizzes(completed);
        } catch (error) {
          console.error("Error fetching completed quizzes:", error);
        }
      };
      fetchCompletedQuizzes();
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      fetchUserProgress();
    }
  }, [userId]);
  // Change title
  useEffect(() => {
    document.title = "WeLearn - Play Game";
  }, []);
  // Fetch progress when a new quiz is selected
  useEffect(() => {
    if (selectedQuiz && userId) {
      fetchQuizProgress();
    }
  }, [selectedQuiz, userId]);

  // ---- AUDIO ------
  useEffect(() => {
    audioRef.current = new Audio("/music/Enchanted Festival.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);
  const playAudio = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.warn("Audio autoplay failed:", error);
      }
    }
  };
  useEffect(() => {
    playAudio();
  }, []);
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted((prevMuted) => !prevMuted);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get(`/api/progress/user/${userId}/summary`);

      const quizzes = response.data.quizzes;
      setUserProgress(quizzes);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const fetchQuizProgress = async () => {
    if (!selectedQuiz || !userId) return;

    try {
      const response = await axios.get(
        `/api/progress/${userId}/${selectedQuiz._id}`
      );

      if (response.data.progress) {
        setIsQuizCompleted(response.data.progress.completed);
        setIsButtonDisabled(response.data.progress.completed);

        if (response.data.progress.completed) {
          setCompletedQuizzes((prev) => new Set([...prev, selectedQuiz._id]));
        }
      }
    } catch (error) {
      console.warn("No quiz progress, it's a new quiz: ", error.message);
      // If no progress found, it's a new quiz for the user
      setIsQuizCompleted(false);
      setIsButtonDisabled(false);
    }
  };

  const updateProgress = async (isCorrect, timeSpent) => {
    try {
      await axios.post(`/api/progress/${userId}/${selectedQuiz._id}/answer`, {
        questionId: selectedQuiz._id,
        userAnswer,
        isCorrect,
        timeSpent,
        completed: isCorrect,
      });

      if (isCorrect) {
        // Update coins with explicit operation
        const updatedUser = await axios.put(`/api/users/${userId}/coins`, {
          coins: 100,
          operation: "add",
        });

        const newCoins = updatedUser.data.coins;
        updateUser({ ...user, coins: newCoins });
        localStorage.setItem("coins", newCoins.toString());

        return newCoins;
      }
    } catch (error) {
      console.error(
        "Error updating progress:",
        error.response?.data || error.message
      );
      return null;
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        const cleanUserAnswer = userAnswer.trim().toLowerCase();
        const cleanCorrectAnswer = selectedQuiz.answer.trim().toLowerCase();
        const isCorrect = cleanUserAnswer === cleanCorrectAnswer;
        const timeSpent = time;

        try {
          const updatedUserCoins = await updateProgress(isCorrect, timeSpent);
          if (isCorrect) {
            // Fetch updated user progress after correct answer
            await fetchUserProgress();
            // Update completed quizzes set
            setCompletedQuizzes((prev) => new Set([...prev, selectedQuiz._id]));
            Swal.fire({
              title: "Correct!",
              text: `You earned 100 coins! Your new coins is ${updatedUserCoins}`,
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
            }
            setIsQuizCompleted(true);
            setIsButtonDisabled(true);
            setUserAnswer("");
            setIsBlurred(true);
            setTime(0);
            setIsActive(false);
            setHasStarted(false);
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

            // Reset states for wrong answer
            setUserAnswer("");
          }
        } catch (error) {
          console.error("Error handling answer submission:", error);
          Swal.fire({
            title: "Error",
            text: "There was an error submitting your answer. Please try again.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleShowAnswer = () => {
    if (!user || user.coins === undefined || user.coins === null) {
      console.log("User data is not loaded yet");
      return;
    }

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
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (user.coins >= 300) {
          try {
            const response = await axios.put(`/api/users/${userId}/coins`, {
              coins: 300,
              operation: "subtract",
            });

            const updatedCoins = response.data.coins;
            setUserAnswer(selectedQuiz.answer);
            updateUser({ ...user, coins: updatedCoins });
            localStorage.setItem("coins", updatedCoins.toString());
            Swal.fire({
              title: "Answer Revealed!",
              text: `New Coins: ${updatedCoins}. Keep going to earn more!`,
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
          } catch (error) {
            console.error("Error updating coins:", error);
            // Handle error case
          }
        } else {
          Swal.fire({
            title: "Not enough coins!",
            text: `You need at least 300 coins to show answer. Coins: ${user.coins}`,
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
  const handleStart = () => {
    if (hasStarted) {
      return;
    }
    setIsActive(true);
    setIsBlurred(false);
    setHasStarted(true);
    setTime(0);
    setIsButtonDisabled(true);
  };
  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setUserAnswer("");
    setIsBlurred(true);
    setIsActive(false);
    setTime(0);
    setIsButtonDisabled(false);
    setIsQuizCompleted(false);
    setHasStarted(false);
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
      className="custom-cursor flex h-screen overflow-hidden"
    >
      {" "}
      {/* Add audio control button */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors"
      >
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>
      <button
        onClick={playAudio} // Play audio directly on button click
        className="fixed top-4 right-4 p-2 bg-green-500 text-white hover:bg-green-600 transition"
      >
        Play Audio
      </button>
      <Sidebar
        onQuizSelect={handleQuizSelect}
        userProgress={userProgress}
        completedQuizzes={completedQuizzes}
      />
      <div className="main-content">
        <div className="exercise w-full">
          {selectedQuiz ? (
            <>
              {/* title and instruction component */}
              <TitleAndInstruction selectedQuiz={selectedQuiz} />

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
                        disabled={hasStarted || isQuizCompleted}
                        onClick={handleStart}
                        className={`primary start-button ${
                          (isButtonDisabled && isQuizCompleted) || hasStarted
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
                        disabled={isBlurred || isQuizCompleted}
                        id="answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="answer-input jetbrains p-2 text-xl"
                        placeholder="Type your answer here..."
                      />
                      <button
                        type="submit"
                        disabled={isBlurred || isQuizCompleted}
                        className="primary submit-answer-button"
                      >
                        Submit Answer &gt;
                      </button>
                    </form>
                  </div>
                  {/* show answer button */}
                  <button
                    className="ex-area-btn show-btn"
                    onClick={handleShowAnswer}
                    disabled={isBlurred || isQuizCompleted}
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
            <Placeholder />
          )}
        </div>
      </div>
    </main>
  );
}
