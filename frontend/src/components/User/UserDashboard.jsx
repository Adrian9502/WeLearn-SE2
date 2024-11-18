import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";
import axios from "axios";
import Title from "./components/Sidebar/Title";
import Placeholder from "./components/Quiz/Placeholder";
import { useUser } from "./UserContext";
import QuizInterface from "./components/Quiz/QuizInterface";
import ProgressDisplay from "./components/Sidebar/ProgressDisplay";
import RankingsDisplay from "./components/Sidebar/RankingDisplay";

export default function UserDashboard() {
  // pop up component onclick
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isRankingVisible, setIsRankingVisible] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const { user, updateUser } = useUser();
  const [time, setTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
  const [hasShownAnswer, setHasShownAnswer] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    // change the title
    document.title = "WeLearn - Play";
  }, []);
  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio("/music/Enchanted Festival.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.7;
    audioRef.current.play().catch(console.warn);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);
  // Fetch completed quizzes
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.userId) return;

      try {
        const response = await axios.get(
          `/api/progress/user/${user.userId}/summary`
        );
        const completed = new Set(
          response.data.quizzes
            .filter((quiz) => quiz.completed)
            .map((quiz) => quiz.quizId._id)
        );
        setCompletedQuizzes(completed);
        setUserProgress(response.data.quizzes);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [user?.userId]);
  // Timer effect
  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const updateProgress = async (isCorrect, timeSpent) => {
    try {
      // Make the progress update API call
      const progressResponse = await axios.post(
        `/api/progress/${user.userId}/${selectedQuiz._id}/answer`,
        {
          questionId: selectedQuiz._id,
          userAnswer,
          isCorrect,
          timeSpent,
          completed: isCorrect,
        }
      );

      if (isCorrect) {
        // Update coins
        const updatedUser = await axios.put(`/api/users/${user.userId}/coins`, {
          coins: 100,
          operation: "add",
        });

        // Update completedQuizzes state
        setCompletedQuizzes((prev) => new Set([...prev, selectedQuiz._id]));

        // Update userProgress state
        setUserProgress((prevProgress) => {
          if (!prevProgress) return prevProgress;

          const updatedProgress = prevProgress.map((progress) => {
            if (progress.quizId._id === selectedQuiz._id) {
              return {
                ...progress,
                completed: true,
                lastAttempt: new Date().toISOString(),
                attempts: (progress.attempts || 0) + 1,
              };
            }
            return progress;
          });

          // If the quiz wasn't in progress before, add it
          if (!prevProgress.some((p) => p.quizId._id === selectedQuiz._id)) {
            updatedProgress.push({
              quizId: { _id: selectedQuiz._id, title: selectedQuiz.title },
              completed: true,
              lastAttempt: new Date().toISOString(),
              attempts: 1,
            });
          }

          return updatedProgress;
        });

        // Update user state
        updateUser({ ...user, coins: updatedUser.data.coins });
        localStorage.setItem("coins", updatedUser.data.coins.toString());

        return updatedUser.data.coins;
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      return null;
    }
  };
  const handleAnswerChange = (e) => {
    const newValue = e.target.value;
    setUserAnswer(newValue);

    // Re-enable show answer button if input is cleared
    if (newValue.trim() === "") {
      setHasShownAnswer(false);
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
        if (!userAnswer) {
          Swal.fire({
            title: "Answer Empty!",
            text: `Provide answer to proceed.`,
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
          return;
        }
        const isCorrect =
          userAnswer.trim().toLowerCase() ===
          selectedQuiz.answer.trim().toLowerCase();
        const updatedUserCoins = await updateProgress(isCorrect, time);

        try {
          if (isCorrect) {
            setCompletedQuizzes((prev) => new Set([...prev, selectedQuiz._id]));
            Swal.fire({
              title: "Correct!",
              text: `You earned 100 coins! Your new coins is ${updatedUserCoins}`,
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
            setIsQuizCompleted(true);
            resetQuizState();
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
    if (!user?.coins || hasShownAnswer) return;

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
      if (result.isConfirmed && user.coins >= 300) {
        try {
          const response = await axios.put(`/api/users/${user.userId}/coins`, {
            coins: 300,
            operation: "subtract",
          });
          setUserAnswer(selectedQuiz.answer);
          setHasShownAnswer(true); // Set the flag when answer is shown

          updateUser({ ...user, coins: response.data.coins });
          localStorage.setItem("coins", response.data.coins.toString());

          Swal.fire({
            title: "Answer Revealed!",
            text: `New Coins: ${response.data.coins}. Keep going to earn more!`,
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
        }
      } else if (result.isConfirmed) {
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
    });
  };
  const resetQuizState = () => {
    setUserAnswer("");
    setIsBlurred(true);
    setIsActive(false);
    setTime(0);
    setHasStarted(false);
    setHasShownAnswer(false);
  };
  const handleStart = () => {
    if (!hasStarted) {
      setIsActive(true);
      setIsBlurred(false);
      setHasStarted(true);
      setTime(0);
    }
  };
  const handleQuizSelect = (quiz) => {
    // Check if quiz is completed
    const isCompleted =
      completedQuizzes.has(quiz._id) ||
      userProgress?.some(
        (progress) => progress.quizId._id === quiz._id && progress.completed
      );

    // Only allow selection if quiz is not completed
    if (!isCompleted) {
      setSelectedQuiz(quiz);
      resetQuizState();
      setIsQuizCompleted(false);
    }
  };
  const formatTime = () => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleShowProgress = () => {
    setIsProgressVisible(true);
  };
  const handleShowRanking = () => {
    setIsRankingVisible(true);
  };
  const handleClose = () => {
    setIsProgressVisible(false);
    setIsRankingVisible(false);
  };
  return (
    // Main container
    <main
      style={{ fontFamily: "Retro Gaming, Arial, Helvetica, sans-serif" }}
      className="custom-cursor flex h-screen w-full overflow-y-auto relative"
    >
      {/* Hamburger Menu Button (visible on mobile) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 px-4 py-2 btn bg-purple-700 text-white hover:bg-purple-800 transition-colors"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>
      {/* audio control button */}
      <button
        onClick={() => {
          audioRef.current.muted = !audioRef.current.muted;
          setIsMuted(!isMuted);
        }}
        className="fixed top-4 right-4 z-50 px-2 py-1.5 text-sm sm:px-4 sm:py-2 btn bg-purple-700 text-slate-200 hover:bg-purple-800 transition-colors"
      >
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>
      {/* Sidebar with responsive classes */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform duration-300 ease-in-out fixed lg:relative lg:translate-x-0 z-40 h-full`}
      >
        <Sidebar
          onQuizSelect={(quiz) => {
            handleQuizSelect(quiz);
            if (window.innerWidth < 1024) {
              setIsSidebarOpen(false);
            }
          }}
          userProgress={userProgress}
          completedQuizzes={completedQuizzes}
          onShowProgress={handleShowProgress}
          onShowRankings={handleShowRanking}
          onClose={handleClose}
        />
      </div>
      {/* main quiz ui */}
      <div
        className={`flex-1 overflow-auto px-4 sm:px-6 md:px-9 py-6 md:py-10 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-0" : "ml-0"
        }`}
        style={{
          backgroundImage: "url(/user-dashboard/dungeon-bg-purple.png",
          boxShadow: "1px 0px 21px 18px rgba(0,0,0,0.75) inset",
        }}
      >
        <div className="flex flex-col h-full pt-12 w-full">
          {selectedQuiz ? (
            <>
              <Title selectedQuiz={selectedQuiz} />
              <QuizInterface
                selectedQuiz={selectedQuiz}
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
                handleAnswerChange={handleAnswerChange}
              />
            </>
          ) : (
            <Placeholder />
          )}
        </div>
      </div>

      {isProgressVisible && (
        <ProgressDisplay
          userProgress={userProgress}
          onClose={() => setIsProgressVisible(false)}
        />
      )}
      {isRankingVisible && (
        <RankingsDisplay onClose={() => setIsRankingVisible(false)} />
      )}
    </main>
  );
}
