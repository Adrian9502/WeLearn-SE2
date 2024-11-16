import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import Title from "./components/Title";
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
        confirmButton: "btn primary",
        cancelButton: "btn show-btn",
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
        confirmButton: "btn primary",
        cancelButton: "btn show-btn",
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
                confirmButton: "btn secondary",
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
              confirmButton: "btn secondary",
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
    // Main container
    <main
      style={{ fontFamily: "Retro Gaming, Arial, Helvetica, sans-serif" }}
      className="custom-cursor flex h-screen overflow-hidden"
    >
      {/* audio control button */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 px-4 py-2 btn bg-purple-700 text-white hover:bg-purple-800 transition-colors"
      >
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>
      {/* sidebar */}
      <Sidebar
        onQuizSelect={handleQuizSelect}
        userProgress={userProgress}
        completedQuizzes={completedQuizzes}
      />
      {/* main quiz ui */}
      <div
        style={{
          backgroundImage: "url(/user-dashboard/dungeon-bg-purple.png",
          boxShadow: "1px 0px 21px 18px rgba(0,0,0,0.75) inset",
        }}
        className="flex-1 overflow-hidden px-9 py-10 "
      >
        <div className="flex flex-col h-full pt-12 w-full">
          {selectedQuiz ? (
            <>
              {/* title */}
              <Title selectedQuiz={selectedQuiz} />

              <div className="flex justify-between gap-6 px-2">
                {/* question container */}
                <div
                  style={{ boxShadow: "1px 1px 10px 10px rgba(0,0,0,0.75)" }}
                  className="py-4 px-5 w-fit h-fit my-auto max-w-5xl rounded-lg bg-gradient-to-br border-2 from-slate-900 to-stone-950 border-purple-600 relative flex justify-center items-center"
                >
                  {/* quiz question */}
                  <div className="max-w-full">
                    <div className="text-slate-200 mb-5">
                      <div className="text-lg mb-2">Instructions:</div>
                      <div className="max-w-3xl">
                        {selectedQuiz.instruction}
                      </div>
                    </div>
                    <div className="p-3 w-fit mx-auto border-4 rounded-lg border-slate-500 relative bg-neutral-900">
                      {/* Conditionally add/remove blur class based on isBlurred */}
                      <div className={isBlurred ? "blur" : ""} />
                      <pre className="jetbrains text-nowrap text-2xl">
                        {selectedQuiz.question}
                      </pre>
                    </div>
                  </div>
                </div>
                {/* input and submit button */}
                <div className="flex flex-1 flex-col justify-center items-center">
                  <div className="flex flex-col bg-gradient-to-br from-indigo-950 to-purple-950 p-8 border-2 border-purple-600 rounded-lg">
                    <div className="flex justify-around items-center">
                      <button
                        disabled={hasStarted || isQuizCompleted}
                        onClick={handleStart}
                        className={`btn p-3 bg-gradient-to-r from-green-600 to-teal-600 text-slate-200 transition-colors hover:to-teal-500 hover:text-slate-100 ${
                          (isButtonDisabled && isQuizCompleted) || hasStarted
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                      >
                        START
                      </button>
                      <div className="bg-zinc-950 border-2 border-slate-600 rounded-lg text-lg text-cyan-400 px-6 py-2">
                        <span>Time:</span>{" "}
                        <span className="tracking-widest">{formatTime()}</span>
                      </div>
                    </div>
                    <div className="my-6 flex gap-2 flex-col">
                      <label htmlFor="answer" className="text-xl text-cyan-400">
                        Answer:
                      </label>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleSubmitAnswer();
                        }}
                        className="flex flex-col gap-10"
                      >
                        <textarea
                          type="text"
                          disabled={isBlurred || isQuizCompleted}
                          id="answer"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="rounded-lg w-full max-w-full border-2 border-slate-600 text-cyan-400 bg-slate-950 jetbrains p-2 text-xl flex"
                          placeholder="Type your answer here. If there are 2 or more answer, Separate it by comma ',' eg. 'print, print'"
                        />
                        <div className="flex p-1 gap-5 justify-around">
                          <button
                            type="submit"
                            disabled={isBlurred || isQuizCompleted}
                            className="btn bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-800 transition-colors px-5 py-3 flex items-center justify-center uppercase text-yellow-400"
                          >
                            Submit Answer &gt;
                          </button>
                          {/* show answer button */}
                          <button
                            className="btn bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-800 transition-colors px-4 py-3 flex items-center justify-center uppercase text-yellow-400"
                            onClick={handleShowAnswer}
                            disabled={isBlurred || isQuizCompleted}
                          >
                            Show Answer{" "}
                            <div className="ml-1 flex items-center">
                              (
                              <img
                                src="/coin.gif"
                                className="w-4 h-6"
                                alt="coin"
                              />
                              <div>300</div>)
                            </div>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
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
