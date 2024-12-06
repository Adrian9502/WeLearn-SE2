import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "./UserContext";
import Swal from "sweetalert2";
import UserInfo from "./components/Sidebar/UserInfo";

// Custom hook
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
    userProgress?.some(
      (progress) => progress.quizId._id === quiz._id && progress.completed
    ) || completedQuizzes?.has(quiz._id);

  return (
    <div
      data-quiz-id={quiz._id}
      onClick={isCompleted ? undefined : onClick}
      className={`
        relative btn bg-gradient-to-r overflow-hidden rounded-lg
        ${
          isCompleted
            ? "from-emerald-500 to-emerald-600 cursor-not-allowed"
            : "from-yellow-600 to-amber-600/80 hover:to-yellow-700 cursor-pointer"
        }
        transform transition-all duration-200
        sm:p-3 p-2 shadow-lg`}
    >
      <div className="flex justify-between items-center">
        <span className="text-white">{quiz.title}</span>
        {isCompleted && (
          <div className="flex items-center">
            <div className="sm:w-6 sm:h-6 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
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
          sm:p-3 p-2 transform transition-all duration-200
          shadow-lg
        `}
      >
        <div className="flex justify-between items-center">
          <div className="text-white sm:text-lg">{title}</div>
          {isSectionCompleted() && (
            <div className="flex items-center">
              <div className="sm:w-7 sm:h-7 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
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
export default function Sidebar({
  onQuizSelect,
  userProgress,
  onShowProgress,
  onShowRankings,
  onShowDailyRewards,
  onClose,
  completedQuizzes,
  refreshQuizProgress,
}) {
  // ----- NAVIGATION -----
  const navigate = useNavigate();
  // ----- STATE -----
  const [isExpanded, setIsExpanded] = useState({
    types: {},
    difficulties: {},
  });
  const quizzes = useQuizzes();
  const { user } = useUser();
  const username = user?.username;
  const userId = user?.userId;
  const [userQuizCompleted, setUserQuizCompleted] = useState(null);
  const [userData, setUserData] = useState(null);

  // ----- FETCH USER DATA -----
  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleUserDataUpdate = (newUserData) => {
    setUserData(newUserData);
  };
  useEffect(() => {
    fetchUserData();
  }, [userId]);
  // ----- FETCH USER QUIZ PROGRESS -----
  const fetchUserQuizProgress = async () => {
    try {
      const response = await fetch(`/api/progress/user/${userId}/summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON from the response
      const data = await response.json();

      // Calculate the count of completed and not completed quizzes
      const answeredQuizzesCount = data.quizzes.reduce((count, quiz) => {
        return quiz.completed ? count + 1 : count;
      }, 0);

      // Update the states for completed and not completed quizzes
      setUserQuizCompleted(answeredQuizzesCount);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };
  // ----- USE EFFECTS -----
  useEffect(() => {
    if (userId) {
      fetchUserQuizProgress();
    }
  }, [userId, userQuizCompleted, refreshQuizProgress]);

  const organizedQuizzes = useMemo(() => {
    const categorizedQuizzes = {};

    quizzes.forEach((quiz) => {
      // Organize by category
      if (!categorizedQuizzes[quiz.category]) {
        categorizedQuizzes[quiz.category] = {};
      }

      // Organize by type within category
      if (!categorizedQuizzes[quiz.category][quiz.type]) {
        categorizedQuizzes[quiz.category][quiz.type] = {};
      }

      // Organize by difficulty within type
      if (!categorizedQuizzes[quiz.category][quiz.type][quiz.difficulty]) {
        categorizedQuizzes[quiz.category][quiz.type][quiz.difficulty] = [];
      }

      categorizedQuizzes[quiz.category][quiz.type][quiz.difficulty].push(quiz);
    });

    return categorizedQuizzes;
  }, [quizzes]);
  // ----- COMPUTE TOTAL QUIZZES -----
  const totalQuizzes = useMemo(() => {
    return Object.values(organizedQuizzes).reduce(
      (total, types) =>
        total +
        Object.values(types).reduce(
          (subtotal, difficulties) =>
            subtotal +
            Object.values(difficulties).reduce(
              (quizCount, quizList) => quizCount + quizList.length,
              0
            ),
          0
        ),
      0
    );
  }, [organizedQuizzes]);
  // ----- TOGGLE EXPAND STATE FOR NESTED NAVIGATION -----
  const toggleExpand = useCallback((level, key) => {
    setIsExpanded((prev) => ({
      ...prev,
      [level]: {
        ...prev[level],
        [key]: !prev[level]?.[key],
      },
    }));
  }, []);
  // set color based on difficulty
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return {
          parent: "bg-green-700/30",
          button: "from-green-600 to-green-700 hover:to-green-600",
        };
      case "medium":
        return {
          parent: "bg-yellow-700/30",
          button: "from-yellow-600 to-yellow-700 hover:to-yellow-600",
        };
      case "hard":
        return {
          parent: "bg-red-700/30",
          button: "from-red-600 to-red-700 hover:to-red-600",
        };
      default:
        return {
          parent: "bg-blue-700/30",
          button: "from-blue-600 to-blue-700 hover:to-blue-600",
        };
    }
  };
  // Render nested quiz navigation
  const renderQuizNavigation = () => {
    return Object.entries(organizedQuizzes).map(([category, types]) => (
      <div
        key={category}
        className="relative bg-gradient-to-b from-gray-950 to-neutral-950 border-4 border-purple-600 rounded-lg p-3 mb-4 
        overflow-hidden 
        "
      >
        <h2
          className="text-2xl text-center text-yellow-400 mb-4 
          tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]"
        >
          {category}
        </h2>

        {Object.entries(types).map(([type, difficulties]) => (
          <div
            key={type}
            className="mt-3 mb-2 diagonal rounded-xl bg-indigo-900"
          >
            <div
              onClick={() => toggleExpand("types", type)}
              className="relative text-lg sm:text-xl text-slate-100 text-center 
              bg-gradient-to-r from-violet-700 to-purple-800 btn rounded-lg 
              sm:p-3 p-2 cursor-pointer uppercase tracking-wider
              transform hover:to-purple-600 transition-colors duration-200
              shadow-lg"
            >
              {type}
            </div>

            {isExpanded.types?.[type] &&
              Object.entries(difficulties).map(([difficulty, quizList]) => (
                <div
                  key={difficulty}
                  className={`mt-2 pb-2 w-[96%] mx-auto rounded-xl ${
                    getDifficultyColor(difficulty).parent || "bg-blue-100/20"
                  }`}
                >
                  <div
                    onClick={() => toggleExpand("difficulties", difficulty)}
                    className={`px-2.5 bg-gradient-to-r text-center text-white 
                      ${
                        getDifficultyColor(difficulty).button ||
                        "bg-blue-600 hover:bg-blue-700"
                      } 
                      btn rounded-lg 
                      py-3 cursor-pointer uppercase text-center tracking-wider
                      transition-colors duration-200
                      shadow-md`}
                  >
                    {difficulty}
                  </div>

                  {isExpanded.difficulties?.[difficulty] && (
                    <div className="mt-2 space-y-3">
                      {quizList.map((quiz) => (
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
              ))}
          </div>
        ))}
      </div>
    ));
  };
  // ----- LOGOUT HANDLER -----
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
        "#fff url(https://cdn.vectorstock.com/i/1000v/38/53/pixel-art-style-purple-gradient-background-vector-8473853.jpg)",
      customClass: {
        popup: "swal-font",
        confirmButton: "btn-swal primary",
        cancelButton: "btn-swal show-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <aside
      style={{
        backgroundImage: "url(/user-dashboard/brick.png)",
        boxShadow: "1px 0px 21px 18px rgba(0,0,0,0.75) inset",
        WebkitBoxShadow: "1px 0px 21px 18px rgba(0,0,0,0.75) inset",
        MozBoxShadow: "1px 0px 21px 18px rgba(0,0,0,0.75) inset",
      }}
      className="h-screen w-60 sm:w-72 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-700 flex flex-col"
    >
      {/* Scrollable container for sidebar content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <div className="max-w-60 mx-auto">
            {/* Fixed position elements */}
            <div className="border-2 mt-14 lg:mt-4 border-purple-700 rounded-lg diagonal flex flex-col items-center">
              <img
                src="/Welearn-small-logo.png"
                className="w-36 sm:w-44 my-2 pointer-events-none"
                alt="WeLearn logo"
              />
            </div>

            {/* Text below logo */}
            <h1 className="text-base border-2 diagonal border-purple-600 rounded-lg p-2 sm:text-xl text-center text-yellow-400 mt-3 mb-8">
              Master Sorting Algorithm & Binary Operations
            </h1>

            {/* Completed Quizzes */}
            <div className="border border-purple-500 relative bg-gradient-to-b from-purple-800/50 to-indigo-800/50 rounded-xl p-2 sm:p-4">
              <img
                src="/torch-gif.gif"
                className="w-5 sm:w-6 absolute left-2 pointer-events-none"
                alt="torch gif"
              />
              <img
                src="/torch-gif.gif"
                className="w-5 sm:w-6 absolute right-2 pointer-events-none"
                alt="torch gif"
              />
              <div className="text-center space-y-2">
                <span className="text-white sm:text-lg">Completed</span>
                <div className="text-2xl sm:text-3xl font-game">
                  <span className="text-yellow-400">{userQuizCompleted}</span>
                  <span className="text-white mx-2">of</span>
                  <span className="text-yellow-400">{totalQuizzes}</span>
                </div>
                <span className="text-white lg:text-lg">exercises</span>
              </div>
            </div>

            {/* User Info */}
            <UserInfo
              onLogout={handleLogout}
              username={username}
              coins={user?.coins || 0}
              userProgress={userProgress}
              onShowProgress={onShowProgress}
              onShowRankings={onShowRankings}
              onShowDailyRewards={onShowDailyRewards}
              onClose={onClose}
              userData={userData}
              onUserDataUpdate={handleUserDataUpdate}
            />

            {/* Quiz Titles */}
            <div className="space-y-3 sm:space-y-6">
              {renderQuizNavigation()}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// PropTypes
Sidebar.propTypes = {
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
  onShowProgress: PropTypes.func.isRequired,
  onShowRankings: PropTypes.func.isRequired,
  onShowDailyRewards: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  completedQuizzes: PropTypes.instanceOf(Set), // Add this prop type
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
  completedQuizzes: PropTypes.instanceOf(Set),
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
  completedQuizzes: PropTypes.instanceOf(Set),
};
