import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Constants
const QUIZ_TYPES = {
  BUBBLE: "bubble",
  MERGE: "merge",
  INSERTION: "insertion",
  SELECTION: "selection",
  // Binary Algo
  ADDITION: "addition",
  SUBTRACTION: "subtraction",
  ALPHABET: "alphabet",
};

const INITIAL_EXPANDED_STATE = {
  [QUIZ_TYPES.BUBBLE]: false,
  [QUIZ_TYPES.MERGE]: false,
  [QUIZ_TYPES.INSERTION]: false,
  [QUIZ_TYPES.SELECTION]: false,
  // binary algo
  [QUIZ_TYPES.ADDITION]: false,
  [QUIZ_TYPES.SUBTRACTION]: false,
  [QUIZ_TYPES.ALPHABET]: false,
};

// Custom hooks
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) {
        return initialValue;
      }

      // Try to parse as JSON, if fails return the raw value
      try {
        return JSON.parse(storedValue);
      } catch {
        return storedValue;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);

        // Handle different types of values appropriately
        const valueToSave =
          typeof valueToStore === "string"
            ? valueToStore
            : JSON.stringify(valueToStore);

        localStorage.setItem(key, valueToSave);
      } catch (error) {
        console.warn(`Error saving to localStorage key "${key}":`, error);
      }
    },
    [key, value]
  );

  return [value, setStoredValue];
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

// Components
const UserInfo = ({ username, coins, onLogout }) => (
  <div className="flex my-8 flex-col gap-4">
    {/* use image, username coins */}
    <div className="coins">
      <div className="flex gap-2 items-center flex-col">
        <h1 className="text-center">USER INFO</h1>
        <div className="flex sidebar-user gap-3 p-2">
          <div className="sidebar-user-image">
            <img src="/user.png" className="pointer-events-none" alt="User" />
          </div>
          <span>{username}</span>
        </div>
        <div className="flex sidebar-user px-2 py-1 items-center justify-center">
          <img
            src="/coin.gif"
            className="coins-image pointer-events-none"
            alt="Coins"
          />
          <div>
            <span className="text-sm">Coins:</span>
            <span>{coins}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-around">
      {/* log out button */}
      <button onClick={onLogout} className="log-out-btn  p-2">
        Log out
      </button>
      <button onClick={onLogout} className="log-out-btn  p-2">
        Rankings
      </button>
    </div>
  </div>
);
// TODO: CONTINUE EDIT .

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

const QuizItem = ({ quiz, isCompleted, onClick }) => (
  <div
    onClick={onClick}
    className={`flex transition-colors cursor-pointer exercises justify-between items-center p-2
      ${
        isCompleted
          ? "bg-green-600 cursor-not-allowed"
          : "bg-sky-600 hover:bg-sky-700"
      }`}
  >
    <span className="quiz-title">{quiz.title}</span>
    {isCompleted && <span className="text-white ml-2">✓</span>}
  </div>
);

const QuizSection = ({
  title,
  quizzes,
  isExpanded,
  onToggle,
  isQuizCompleted,
  onQuizSelect,
}) => (
  <div className="mt-6 flex flex-col items-center justify-center">
    <div
      className={`exercises w-full text-xl cursor-pointer transition-colors ${title.toLowerCase()} text-white`}
      onClick={() => onToggle(title.toLowerCase())}
    >
      {title}
    </div>
    {isExpanded[title.toLowerCase()] && (
      <div className="flex flex-col gap-5 mt-4">
        {quizzes?.map((quiz) => (
          <QuizItem
            key={quiz._id}
            quiz={quiz}
            isCompleted={isQuizCompleted(quiz._id)}
            onClick={() => onQuizSelect(quiz)}
          />
        ))}
      </div>
    )}
  </div>
);

// Main Component
export default function Sidebar({ onQuizSelect }) {
  const navigate = useNavigate();
  const [username, setUsername] = useLocalStorage("username", "");
  const [coins, setCoins] = useLocalStorage("coins", 0);
  const [completedQuizzes, setCompletedQuizzes] = useLocalStorage(
    "completedQuizzes",
    []
  );
  const [isExpanded, setIsExpanded] = useState(INITIAL_EXPANDED_STATE);

  const quizzes = useQuizzes();

  // Memoized quiz titles data
  const quizzesTitles = useMemo(
    () => [
      // Sorting Algorithms
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
      // Binary Operation
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

  // Handlers
  const toggleQuizzes = useCallback((type) => {
    setIsExpanded((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  const isQuizCompleted = useCallback(
    (quizId) => completedQuizzes.includes(quizId),
    [completedQuizzes]
  );

  const handleQuizSelect = useCallback(
    (quiz) => {
      if (!isQuizCompleted(quiz._id)) {
        onQuizSelect({
          ...quiz,
          onComplete: () => {
            setCompletedQuizzes((prev) => [...prev, quiz._id]);
          },
        });
      }
    },
    [isQuizCompleted, onQuizSelect, setCompletedQuizzes]
  );

  const handleLogout = useCallback(() => {
    ["authToken", "userRole", "username", "coins"].forEach((key) =>
      localStorage.removeItem(key)
    );
    navigate("/");
  }, [navigate]);

  // Storage event listener
  useEffect(() => {
    const handleStorageChange = () => {
      const newCoins = parseInt(localStorage.getItem("coins")) || 0;
      setCoins(newCoins);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setCoins]);

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
            <span className="text-yellow-400">{completedQuizzes.length} </span>
            <span className="text-xl">out of</span>
            <span className="text-yellow-400"> {totalQuizzes}</span>
          </span>
          <br />
          exercises
        </div>

        <UserInfo username={username} coins={coins} onLogout={handleLogout} />

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
                  isQuizCompleted={isQuizCompleted}
                  onQuizSelect={handleQuizSelect}
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
};
UserInfo.propTypes = {
  username: PropTypes.string.isRequired,
  coins: PropTypes.number.isRequired,
  onLogout: PropTypes.func.isRequired,
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
  isQuizCompleted: PropTypes.func.isRequired,
  onQuizSelect: PropTypes.func.isRequired,
};
QuizItem.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  isCompleted: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
