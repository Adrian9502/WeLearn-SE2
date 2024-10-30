import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "./UserContext";
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
        const response = await fetch("http://localhost:5000/api/quizzes");
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
// Components
const UserInfo = ({ onLogout, username, coins }) => {
  return (
    <div className="user-info-container flex flex-col items-center justify-center px-6 py-3 my-8">
      <h1 className="text-center text-cyan-400 text-lg mb-2">
        User Information
      </h1>
      {/* username and coins */}
      <div className="inline-flex user-con flex-col items-center px-2 mb-4 py-1 text-slate-100 justify-center">
        <img src="/user.png" alt="User" className="w-8 h-8" />
        <span className="text-lg font-medium">{username}</span>
        <img src="/coin.gif" className="w-10 h-10" alt="Coins" />
        <span className="text-lg font-medium ml-2">{coins}</span>
      </div>
      <div className="flex flex-col gap-3">
        <button className="btn-border p-2 view-progress-btn">
          View Progress
        </button>
        <button onClick={onLogout} className="btn-border log-out-btn p-2 ">
          Log Out
        </button>
        <button className="btn-border leaderboard-btn p-2">
          View Rankings
        </button>
      </div>
    </div>
  );
};

// components
const SidebarIcons = () => (
  <div className="sidebar-icons">
    <Link to="/user-dashboard/home">
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
);

const QuizItem = ({ quiz, onClick, userProgress }) => {
  const isCompleted = findQuizProgress(quiz._id, userProgress);

  return (
    <div
      onClick={onClick}
      className={`flex transition-colors exercises justify-between items-center p-2 ${
        isCompleted
          ? "bg-green-600 pointer-events-none text-slate-200"
          : "bg-red-600 hover:bg-red-700 text-yellow-400"
      } `}
    >
      <span className="quiz-title">{quiz.title}</span>
      {isCompleted && <span className="text-slate-200 text-xl ml-2">✓</span>}
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
}) => {
  // Check if all quizzes in this section are completed
  const isSectionCompleted = () => {
    if (!quizzes || !userProgress) return false;
    return quizzes.every((quiz) => findQuizProgress(quiz._id, userProgress));
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-center">
      <div
        className={`flex items-center justify-between exercises w-full text-xl cursor-pointer transition-colors ${
          isSectionCompleted()
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700"
        } text-slate-200 p-3 flex justify-between items-center`}
        onClick={() => onToggle(title.toLowerCase())}
      >
        <span>{title}</span>
        {isSectionCompleted() && <span className="text-white text-2xl">✓</span>}
      </div>
      {isExpanded[title.toLowerCase()] && (
        <div className="flex flex-col gap-5 mt-4">
          {quizzes?.map((quiz) => (
            <QuizItem
              key={quiz._id}
              quiz={quiz}
              onClick={() => onQuizSelect(quiz)}
              userProgress={userProgress}
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
      const response = await fetch(
        `http://localhost:5000/api/progress/user/${userId}/summary`
      );
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
    navigate("/");
  }, [navigate]);

  return (
    <aside className="sidebar min-h-screen overflow-auto">
      <SidebarIcons />

      <div className="sidebar-content">
        <h2 className="sidebar-title text-xl font-normal mt-5 p-2 text-center">
          Sorting Algorithm and <br /> Binary Operation
        </h2>

        <div className="sidebar-info mt-8 py-1 text-center text-base">
          Completed <br />
          <span className="text-2xl ">
            <span className="text-yellow-400">{userQuizCompleted} </span>
            <span className="text-xl">out of</span>
            <span className="text-yellow-400"> {totalQuizzes}</span>
          </span>
          <br />
          exercises
        </div>

        <UserInfo
          onLogout={handleLogout}
          username={username}
          coins={user?.coins || 0}
        />

        <div className="exercises-container">
          {quizzesTitles.map((section) => (
            <div className="quiz-container p-2 my-6" key={section.sectionTitle}>
              <h2 className="text-2xl text-center ">{section.sectionTitle}</h2>
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
  userProgress: PropTypes.func.isRequired,
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
