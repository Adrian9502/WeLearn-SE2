import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SortingAlgoSidebar({ onQuizSelect }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [coins, setCoins] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState({
    bubble: [],
    merge: [],
    insertion: [],
    selection: [],
  });
  const [isExpanded, setIsExpanded] = useState({
    bubble: false,
    merge: false,
    insertion: false,
    selection: false,
  });

  useEffect(() => {
    fetchQuizzes();
    // Load completed quizzes from localStorage
    const stored = localStorage.getItem("completedQuizzes");
    if (stored) {
      setCompletedQuizzes(JSON.parse(stored));
    }
  }, []);

  const toggleQuizzes = (type) => {
    setIsExpanded((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  // FETCH QUIZZES
  const fetchQuizzes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quizzes");
      const data = await response.json();

      const bubbleSortQuizzes = data.filter((quiz) =>
        quiz.title.includes("Bubble Sort")
      );
      const mergeSortQuizzes = data.filter((quiz) =>
        quiz.title.includes("Merge Sort")
      );
      const insertionSortQuizzes = data.filter((quiz) =>
        quiz.title.includes("Insertion Sort")
      );
      const selectionSortQuizzes = data.filter((quiz) =>
        quiz.title.includes("Selection Sort")
      );

      setFilteredQuizzes({
        bubble: bubbleSortQuizzes,
        merge: mergeSortQuizzes,
        insertion: insertionSortQuizzes,
        selection: selectionSortQuizzes,
      });
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  // Check if a quiz is completed
  const isQuizCompleted = (quizId) => {
    return completedQuizzes.includes(quizId);
  };

  // Mark a quiz as completed
  const markQuizCompleted = (quizId) => {
    const updatedCompleted = [...completedQuizzes, quizId];
    setCompletedQuizzes(updatedCompleted);
    localStorage.setItem("completedQuizzes", JSON.stringify(updatedCompleted));
  };

  // Handle quiz selection with completion check
  const handleQuizSelect = (quiz) => {
    if (!isQuizCompleted(quiz._id)) {
      onQuizSelect({
        ...quiz,
        onComplete: () => markQuizCompleted(quiz._id),
      });
    }
  };

  // Calculate total completed quizzes
  const totalQuizzes = Object.values(filteredQuizzes).flat().length;
  const completedCount = completedQuizzes.length;

  // Rest of your existing code...
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedCoins = localStorage.getItem("coins");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedCoins) {
      setCoins(Number(storedCoins));
    }

    const handleStorageChange = () => {
      const newCoins = parseInt(localStorage.getItem("coins")) || 0;
      setCoins(newCoins);
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const currentCoins = parseInt(localStorage.getItem("coins")) || 0;
      if (currentCoins !== coins) {
        setCoins(currentCoins);
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [coins]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("coins");
    navigate("/");
  };

  return (
    <aside className="sidebar min-h-screen overflow-auto">
      <div className="sidebar-icons">
        <Link to={"/user-dashboard/home"}>
          <div title="Home">
            <img src="/home.png" alt="Home" />
          </div>
        </Link>
        <div title="Reset Score" id="reset">
          <img src="/bin.png" alt="Reset Score" />
        </div>
        <div title="Hide Sidebar" className="hide-sidebar">
          <img src="/close.png" alt="Hide Sidebar" />
        </div>
      </div>

      <div className="sidebar-content">
        <h2 className="sidebar-title text-2xl font-normal mt-5 p-2 text-center">
          SORTING ALGORITHM
        </h2>
        <div className="sidebar-info mt-5 px-3 py-4 text-center text-lg">
          Completed <br />
          <span className="text-2xl">
            {completedCount} of {totalQuizzes}
          </span>{" "}
          <br />
          exercises
        </div>

        <div className="flex justify-center items-center flex-col">
          <div className="sidebar-user p-3 text-center w-fit">
            <div>
              <img src="/user.png" alt="User" />
            </div>
            <span className="text-lg">{username}</span>
            <button onClick={handleLogout} className="log-out-btn p-2">
              Log out
            </button>
          </div>
          <div className="coins">
            <div>
              <img src="/coin.gif" alt="Coins" />
            </div>
            <span className="coins-display">Coins: {coins}</span>
          </div>
        </div>

        <div className="exercises-container">
          {/* Bubble Sort */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <div
              className="exercises w-full text-xl cursor-pointer transition-colors bubble text-white"
              onClick={() => toggleQuizzes("bubble")}
            >
              Bubble Sort
            </div>
            {isExpanded.bubble && (
              <div className="flex flex-col gap-5 mt-4">
                {filteredQuizzes.bubble?.map((quiz) => (
                  <div
                    key={quiz._id}
                    onClick={() => handleQuizSelect(quiz)}
                    className={`flex transition-colors cursor-pointer exercises justify-between items-center p-2
                      ${
                        isQuizCompleted(quiz._id)
                          ? "bg-green-600 cursor-not-allowed"
                          : "bg-sky-600 hover:bg-sky-700"
                      }`}
                  >
                    <span className="quiz-title">{quiz.title}</span>
                    {isQuizCompleted(quiz._id) && (
                      <span className="text-white ml-2">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Merge Sort */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <div
              className="exercises w-full text-xl cursor-pointer transition-colors merge text-white"
              onClick={() => toggleQuizzes("merge")}
            >
              Merge Sort
            </div>
            {isExpanded.merge && (
              <div className="flex flex-col gap-5 mt-4">
                {filteredQuizzes.merge?.map((quiz) => (
                  <div
                    key={quiz._id}
                    onClick={() => handleQuizSelect(quiz)}
                    className={`flex transition-colors cursor-pointer exercises justify-between items-center p-2
                      ${
                        isQuizCompleted(quiz._id)
                          ? "bg-green-600 cursor-not-allowed"
                          : "bg-sky-600 hover:bg-sky-700"
                      }`}
                  >
                    <span className="quiz-title">{quiz.title}</span>
                    {isQuizCompleted(quiz._id) && (
                      <span className="text-white ml-2">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Insertion Sort */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <div
              className="exercises w-full text-xl cursor-pointer transition-colors insertion text-white"
              onClick={() => toggleQuizzes("insertion")}
            >
              Insertion Sort
            </div>
            {isExpanded.insertion && (
              <div className="flex flex-col gap-5 mt-4">
                {filteredQuizzes.insertion?.map((quiz) => (
                  <div
                    key={quiz._id}
                    onClick={() => handleQuizSelect(quiz)}
                    className={`flex transition-colors cursor-pointer exercises justify-between items-center p-2
                      ${
                        isQuizCompleted(quiz._id)
                          ? "bg-green-600 cursor-not-allowed"
                          : "bg-sky-600 hover:bg-sky-700"
                      }`}
                  >
                    <span className="quiz-title">{quiz.title}</span>
                    {isQuizCompleted(quiz._id) && (
                      <span className="text-white ml-2">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selection Sort */}
          <div className="mt-6 flex flex-col items-center justify-center">
            <div
              className="exercises w-full text-xl cursor-pointer transition-colors selection text-white"
              onClick={() => toggleQuizzes("selection")}
            >
              Selection Sort
            </div>
            {isExpanded.selection && (
              <div className="flex flex-col gap-5 mt-4">
                {filteredQuizzes.selection?.map((quiz) => (
                  <div
                    key={quiz._id}
                    onClick={() => handleQuizSelect(quiz)}
                    className={`flex transition-colors cursor-pointer exercises justify-between items-center p-2
                      ${
                        isQuizCompleted(quiz._id)
                          ? "bg-green-600 cursor-not-allowed"
                          : "bg-sky-600 hover:bg-sky-700"
                      }`}
                  >
                    <span className="quiz-title">{quiz.title}</span>
                    {isQuizCompleted(quiz._id) && (
                      <span className="text-white ml-2">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
