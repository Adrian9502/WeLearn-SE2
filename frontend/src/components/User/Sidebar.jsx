import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "./UserContext";
import Swal from "sweetalert2";
import UserInfo from "./components/UserInfo";
// Constants
const QUIZ_TYPES = {
  BUBBLE: "bubble",
  MERGE: "merge",
  INSERTION: "insertion",
  SELECTION: "selection",
  ADDITION: "addition",
  SUBTRACTION: "subtraction",
  ALPHABET: "alphabet",
};
const INITIAL_EXPANDED_STATE = {
  [QUIZ_TYPES.BUBBLE]: false,
  [QUIZ_TYPES.MERGE]: false,
  [QUIZ_TYPES.INSERTION]: false,
  [QUIZ_TYPES.SELECTION]: false,
  [QUIZ_TYPES.ADDITION]: false,
  [QUIZ_TYPES.SUBTRACTION]: false,
  [QUIZ_TYPES.ALPHABET]: false,
};

const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes");
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return quizzes;
};
// function to get user progress
const findQuizProgress = (quizId, userProgress) => {
  return userProgress?.find(
    (progress) => progress.quizId._id === quizId && progress.completed
  );
};
const QuizItem = ({ quiz, onClick, userProgress, completedQuizzes }) => {
  const isCompleted =
    userProgress?.find(
      (progress) => progress.quizId._id === quiz._id && progress.completed
    ) || completedQuizzes?.has(quiz._id);

  return (
    <div
      data-quiz-id={quiz._id}
      onClick={onClick}
      className={`
        relative bg-gradient-to-r overflow-hidden rounded-lg
        ${
          isCompleted
            ? "from-green-600 to-emerald-600  hover:bg-emerald-600 pointer-events-none"
            : "from-yellow-600 to-amber-600/80 hover:bg-amber-700"
        }
        transform hover:scale-105 transition-all duration-200
        p-3 btn cursor-pointer shadow-lg`}
    >
      <div className="flex justify-between items-center">
        <span className="text-white font-game text-lg">{quiz.title}</span>
        {isCompleted && (
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
    </div>
  );
};

const QuizSection = ({
  title,
  quizzes,
  isExpanded,
  onToggle,
  onQuizSelect,
  userProgress,
  completedQuizzes,
}) => {
  const isSectionCompleted = () => {
    if (!quizzes || (!userProgress && !completedQuizzes)) return false;
    return quizzes.every(
      (quiz) =>
        findQuizProgress(quiz._id, userProgress) ||
        completedQuizzes?.has(quiz._id)
    );
  };

  return (
    <div className="mt-4">
      <div
        onClick={() => onToggle(title.toLowerCase())}
        className={`
          relative overflow-hidden btn rounded-lg cursor-pointer
          ${
            isSectionCompleted()
              ? "bg-gradient-to-r from-fuchsia-700 to-purple-600 hover:to-fuchsia-700"
              : "bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:to-indigo-700"
          }
          p-3 transform transition-all duration-200
          shadow-lg
        `}
      >
        <div className="flex justify-between items-center">
          <div className="text-white text-lg">{title}</div>
          {isSectionCompleted() && (
            <div className="flex items-center">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-slate-200 font-bold">✓</span>
              </div>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
      </div>

      {isExpanded[title.toLowerCase()] && (
        <div className="mt-3 space-y-3 p-1.5 bg-gradient-to-b from-purple-900/90 to-fuchsia-900/80 rounded-lg">
          {quizzes?.map((quiz) => (
            <QuizItem
              key={quiz._id}
              quiz={quiz}
              onClick={() => onQuizSelect(quiz)}
              userProgress={userProgress}
              completedQuizzes={completedQuizzes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
export default function Sidebar({ onQuizSelect, userProgress }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(INITIAL_EXPANDED_STATE);
  const quizzes = useQuizzes();
  const { user } = useUser();
  const username = user?.username;
  const userId = user?.userId;

  const [userQuizCompleted, setUserQuizCompleted] = useState(null);

  // Function to fetch user count of completed quiz in quizzes
  const fetchUserQuizCompleted = async () => {
    try {
      const response = await fetch(`/api/progress/user/${userId}/summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the JSON from the response
      const data = await response.json();
      // Calculate the count of quizzes completed
      const completedQuizzesCount = data.quizzes.reduce((count, quiz) => {
        return quiz.completed ? count + 1 : count;
      }, 0);
      // Set the count of completed quizzes in state
      setUserQuizCompleted(completedQuizzesCount);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserQuizCompleted();
    }
  }, [userId]);

  const quizzesTitles = useMemo(
    () => [
      // sorting algorithm
      {
        sectionTitle: "Sorting Algorithms",
        quizzes: [
          {
            title: "Bubble Sort",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Bubble Sort")
            ),
          },
          {
            title: "Merge Sort",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Merge Sort")
            ),
          },
          {
            title: "Insertion Sort",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Insertion Sort")
            ),
          },
          {
            title: "Selection Sort",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Selection Sort")
            ),
          },
        ],
      },
      // binary operation
      {
        sectionTitle: "Binary Operation",
        quizzes: [
          {
            title: "Addition",
            quizzes: quizzes.filter((quiz) => quiz.title.includes("Addition")),
          },
          {
            title: "Subtraction",
            quizzes: quizzes.filter((quiz) =>
              quiz.title.includes("Subtraction")
            ),
          },
          {
            title: "Alphabet",
            quizzes: quizzes.filter((quiz) => quiz.title.includes("Alphabet")),
          },
        ],
      },
    ],
    [quizzes]
  );
  // compute total quizzes
  const totalQuizzes = useMemo(
    () =>
      quizzesTitles.reduce(
        (total, section) =>
          total +
          section.quizzes.reduce(
            (subTotal, quizGroup) => subTotal + quizGroup.quizzes.length,
            0
          ),
        0
      ),
    [quizzesTitles]
  );
  const toggleQuizzes = useCallback((type) => {
    setIsExpanded((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  const handleQuizSelect = useCallback(
    (quiz) => {
      onQuizSelect(quiz);
    },
    [onQuizSelect]
  );

  const handleLogout = useCallback(() => {
    ["authToken", "userRole", "username", "coins", "userId"].forEach((key) =>
      localStorage.removeItem(key)
    );
    Swal.fire({
      title: "Log out?",
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
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <aside
      style={{
        backgroundImage:
          "url(https://img.freepik.com/premium-vector/purple-brick-wall-seamless-texture-vector-illustration-industrial-background_520826-3748.jpg?semt=ais_hybrid)",
      }}
      className="min-h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-700 overflow-auto p-3"
    >
      <div className="max-w-60 mx-auto">
        {/* Welearn Logo container */}
        <div className="border-2 border-purple-700 rounded-lg diagonal flex flex-col items-center">
          <img
            src="/Welearn-small-logo.png"
            className="w-44 my-2 pointer-events-none"
            alt=""
          />
        </div>
        {/* Text below logo */}
        <h1 className="text-xl text-center text-yellow-300 mt-3 mb-8">
          Master Sorting Algorithm & Binary Operations
        </h1>
        {/* Completed Quizzes */}
        <div className="border border-purple-500 relative bg-gradient-to-b from-purple-800/50 to-indigo-800/50 rounded-xl p-4 mb-8">
          <img
            src="/torch-gif.gif"
            className="w-6 absolute left-2  pointer-events-none"
            alt="torch gif"
          />
          <img
            src="/torch-gif.gif"
            className="w-6 absolute right-2 pointer-events-none"
            alt="torch gif"
          />
          <div className="text-center space-y-2">
            <span className="text-white text-lg">Completed</span>
            <div className="text-3xl font-game">
              <span className="text-yellow-400">{userQuizCompleted}</span>
              <span className="text-white mx-2">of</span>
              <span className="text-yellow-400">{totalQuizzes}</span>
            </div>
            <span className="text-white text-lg">exercises</span>
          </div>
        </div>
        {/* User Info */}
        <UserInfo
          onLogout={handleLogout}
          username={username}
          coins={user?.coins || 0}
          userProgress={userProgress}
        />
        {/* Quiz Titles */}
        <div className="space-y-6">
          {quizzesTitles.map((section) => (
            <div
              key={section.sectionTitle}
              className="bg-gradient-to-b from-slate-950/80 to-indigo-950/80 rounded p-2"
            >
              <h2 className="text-2xl text-center text-yellow-400 mb-4">
                {section.sectionTitle}
              </h2>
              {section.quizzes.map((quiz) => (
                <QuizSection
                  key={quiz.title}
                  title={quiz.title}
                  quizzes={quiz.quizzes}
                  isExpanded={isExpanded}
                  onToggle={toggleQuizzes}
                  onQuizSelect={handleQuizSelect}
                  userProgress={userProgress}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Prop types
Sidebar.propTypes = {
  onQuizSelect: PropTypes.func.isRequired,
  userProgress: PropTypes.array,
  completedQuizzes: PropTypes.instanceOf(Set),
};

QuizItem.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  userProgress: PropTypes.arrayOf(
    PropTypes.shape({
      quizId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }),
      completed: PropTypes.bool.isRequired,
    })
  ),
};

QuizSection.propTypes = {
  title: PropTypes.string.isRequired,
  quizzes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  isExpanded: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onQuizSelect: PropTypes.func.isRequired,
  userProgress: PropTypes.arrayOf(
    PropTypes.shape({
      quizId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }),
      completed: PropTypes.bool.isRequired,
    })
  ),
};
