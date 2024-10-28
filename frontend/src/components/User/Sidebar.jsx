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

// Components
const UserInfo = ({ onLogout }) => {
  const { user } = useUser();

  return (
    <div className="flex my-8 flex-col gap-4">
      <div className="coins">
        <div className="flex gap-2 items-center flex-col">
          <h1 className="text-center">USER INFO</h1>
          <div className="flex sidebar-user gap-3 p-2">
            <div className="sidebar-user-image">
              <img src="/user.png" className="pointer-events-none" alt="User" />
            </div>
            <span>{user?.username}</span>
          </div>
          <div className="flex sidebar-user px-2 py-1 items-center justify-center">
            <img
              src="/coin.gif"
              className="coins-image pointer-events-none"
              alt="Coins"
            />
            <div>
              <span>{user?.coins}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-around">
        <button onClick={onLogout} className="log-out-btn p-2">
          Log out
        </button>
        <button className="log-out-btn p-2">Rankings</button>
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

const QuizItem = ({ quiz, onClick }) => (
  <div
    onClick={onClick}
    className="flex transition-colors cursor-pointer exercises justify-between items-center p-2 bg-sky-600 hover:bg-sky-700"
  >
    <span className="quiz-title">{quiz.title}</span>
  </div>
);

const QuizSection = ({
  title,
  quizzes,
  isExpanded,
  onToggle,
  onQuizSelect,
}) => {
  return (
    <div className="mt-6 flex flex-col items-center justify-center">
      <div
        className={`exercises border w-full text-xl cursor-pointer transition-colors ${title.toLowerCase()} text-white`}
        onClick={() => onToggle(title.toLowerCase())}
      >
        {title}
      </div>
      {isExpanded[title.toLowerCase()] && (
        <div className="flex flex-col gap-5 mt-4">
          {quizzes?.map((quiz) => (
            <div key={quiz._id}>
              <QuizItem quiz={quiz} onClick={() => onQuizSelect(quiz)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
export default function Sidebar({ onQuizSelect }) {
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(INITIAL_EXPANDED_STATE);

  const quizzes = useQuizzes();

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
            <span className="text-yellow-400">2 </span>
            <span className="text-xl">out of</span>
            <span className="text-yellow-400"> {totalQuizzes}</span>
          </span>
          <br />
          exercises
        </div>

        <UserInfo onLogout={handleLogout} />

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
};

QuizItem.propTypes = {
  quiz: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
