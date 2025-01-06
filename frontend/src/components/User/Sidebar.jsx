import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "./UserContext";
import Swal from "sweetalert2";
import UserInfo from "./components/Sidebar/UserInfo";
import QuizItem from "./components/Quiz/QuizItem";
import useQuizzes from "./components/Quiz/utils/useQuizzes";

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
  const [activeItems, setActiveItems] = useState({
    category: null,
    type: null,
    difficulty: null,
  });

  const quizzes = useQuizzes();
  const { user } = useUser();
  const username = user?.username;
  const userId = user?.userId;
  const [userQuizCompleted, setUserQuizCompleted] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // ----- HANDLE USER DATA UPDATE -----
  const handleUserDataUpdate = (newUserData) => {
    setUserData(newUserData);
  };

  // ----- USE EFFECT TO FETCH USER DATA -----
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // ----- FETCH USER QUIZ PROGRESS -----
  const fetchUserQuizProgress = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/progress/user/${userId}/summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const answeredQuizzesCount = data.quizzes.reduce((count, quiz) => {
        return quiz.completed ? count + 1 : count;
      }, 0);

      setUserQuizCompleted(answeredQuizzesCount);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ----- USE EFFECTS -----
  useEffect(() => {
    if (userId) {
      fetchUserQuizProgress();
    }
  }, [userId, userQuizCompleted, refreshQuizProgress]);

  // ----- ORGANIZE QUIZZES -----
  const organizedQuizzes = useMemo(() => {
    const categorizedQuizzes = {};

    const difficultyOrder = {
      easy: 0,
      medium: 1,
      hard: 2,
    };

    quizzes.forEach((quiz) => {
      const { category, type, difficulty } = quiz;

      if (!categorizedQuizzes[category]) {
        categorizedQuizzes[category] = {};
      }
      if (!categorizedQuizzes[category][type]) {
        categorizedQuizzes[category][type] = {};
      }
      if (!categorizedQuizzes[category][type][difficulty.toLowerCase()]) {
        categorizedQuizzes[category][type][difficulty.toLowerCase()] = [];
      }

      categorizedQuizzes[category][type][difficulty.toLowerCase()].push(quiz);
    });

    // Sort quizzes within each difficulty level
    Object.keys(categorizedQuizzes).forEach((category) => {
      Object.keys(categorizedQuizzes[category]).forEach((type) => {
        // Sort difficulties
        const sortedDifficulties = Object.entries(
          categorizedQuizzes[category][type]
        )
          .sort(
            ([diffA], [diffB]) =>
              difficultyOrder[diffA] - difficultyOrder[diffB]
          )
          .reduce((acc, [diff, quizzes]) => {
            acc[diff] = quizzes;
            return acc;
          }, {});

        categorizedQuizzes[category][type] = sortedDifficulties;

        // Then sort quizzes within each difficulty
        Object.keys(sortedDifficulties).forEach((difficulty) => {
          sortedDifficulties[difficulty].sort((a, b) => {
            const numA = parseInt(a.title.match(/\d+/)?.[0] || 0);
            const numB = parseInt(b.title.match(/\d+/)?.[0] || 0);
            return numA - numB;
          });
        });
      });
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
    setActiveItems((prev) => {
      // If clicking the same item, close it
      if (prev[level] === key) {
        return {
          ...prev,
          [level]: null,
          // Reset lower levels when closing a parent
          ...(level === "category" && { type: null, difficulty: null }),
          ...(level === "type" && { difficulty: null }),
        };
      }

      // If clicking a different item, switch to it
      return {
        ...prev,
        [level]: key,
        // Reset lower levels when changing parent
        ...(level === "category" && { type: null, difficulty: null }),
        ...(level === "type" && { difficulty: null }),
      };
    });
  }, []);

  // ----- GET DIFFICULTY COLOR -----
  const getDifficultyColor = (difficulty, isLocked = false) => {
    const baseColors = {
      easy: {
        parent: "bg-green-700/30",
        button: "from-green-600 to-green-700 hover:to-green-600",
      },
      medium: {
        parent: "bg-yellow-700/30",
        button: "from-yellow-600 to-yellow-700 hover:to-yellow-600",
      },
      hard: {
        parent: "bg-red-700/30",
        button: "from-red-600 to-red-700 hover:to-red-600",
      },
    };

    const colors = baseColors[difficulty.toLowerCase()] || {
      parent: "bg-blue-700/30",
      button: "from-blue-600 to-blue-700 hover:to-blue-600",
    };

    if (isLocked) {
      return {
        parent: `${colors.parent} opacity-50`,
        button: `${colors.button} opacity-50`,
      };
    }

    return colors;
  };

  // ---- CHECK IF THE OTHER DIFFICULTY ARE UNLOCKED
  const isDifficultyUnlocked = useCallback(
    (category, type, currentDifficulty) => {
      try {
        const difficultyOrder = ["easy", "medium", "hard"];
        const currentDifficultyIndex = difficultyOrder.indexOf(
          currentDifficulty.toLowerCase()
        );

        if (currentDifficultyIndex === 0) return true;

        const previousDifficulty = difficultyOrder[currentDifficultyIndex - 1];
        const previousDifficultyQuizzes =
          organizedQuizzes[category]?.[type]?.[previousDifficulty] || [];

        const completedQuizzes = previousDifficultyQuizzes.filter((quiz) => {
          const isCompleted = userProgress?.some(
            (progress) =>
              progress.quizId?._id === quiz._id && progress.completed === true
          );
          return isCompleted;
        });

        return (
          completedQuizzes.length === previousDifficultyQuizzes.length &&
          previousDifficultyQuizzes.length > 0
        );
      } catch (error) {
        console.error("Error in isDifficultyUnlocked:", error);
        return false;
      }
    },
    [organizedQuizzes, userProgress]
  );

  // ----- RENDER QUIZ NAVIGATION -----
  const renderQuizNavigation = () => {
    return Object.entries(organizedQuizzes).map(([category, types]) => (
      <div
        key={category}
        className="relative bg-gradient-to-b from-gray-950 to-neutral-950 border-4 border-purple-600 rounded-lg p-3 mb-4 overflow-hidden"
      >
        <h2 className="text-2xl text-center text-yellow-400 mb-4 tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
          {category}
        </h2>

        {Object.entries(types).map(([type, difficulties]) => (
          <div key={type} className="mt-3 mb-2 rounded-xl diagonal">
            <div
              onClick={() => toggleExpand("type", type)}
              className="relative text-lg sm:text-xl text-slate-100 text-center 
              bg-gradient-to-r from-violet-700 to-purple-800 btn rounded-lg 
              sm:p-3 p-2 cursor-pointer uppercase tracking-wider
              transform hover:to-purple-600 transition-colors duration-200
              shadow-lg"
            >
              {type}
            </div>

            {activeItems.type === type &&
              Object.entries(difficulties).map(([difficulty, quizList]) => {
                const isUnlocked = isDifficultyUnlocked(
                  category,
                  type,
                  difficulty
                );

                return (
                  <div
                    key={difficulty}
                    className={`mt-2 pb-2 w-[93%] mx-auto rounded-xl ${
                      getDifficultyColor(difficulty, !isUnlocked).parent
                    }`}
                  >
                    <div
                      onClick={() => {
                        if (isUnlocked) {
                          toggleExpand("difficulty", difficulty);
                        } else {
                          const previousDifficulty =
                            difficulty.toLowerCase() === "medium"
                              ? "easy"
                              : "medium";
                          const previousQuizzes =
                            organizedQuizzes[category]?.[type]?.[
                              previousDifficulty
                            ] || [];
                          const completedCount =
                            userProgress?.filter((progress) =>
                              previousQuizzes.some(
                                (quiz) =>
                                  quiz._id === progress.quizId?._id &&
                                  progress.completed
                              )
                            ).length || 0;

                          Swal.fire({
                            icon: "warning",
                            title: "Difficulty Locked",
                            html:
                              `Complete all ${previousDifficulty} quizzes first!<br><br>` +
                              `Progress: ${completedCount}/${previousQuizzes.length} completed`,
                            confirmButtonText: "OK, Cool",
                            confirmButtonColor: "#3085d6",
                            width: 500,
                            padding: "1em",
                            color: "#c3e602",
                            background:
                              "#fff url(https://images.pond5.com/pixel-sky-pixel-background-cloud-footage-226558718_iconl.jpeg)",
                            customClass: {
                              popup: "swal-font",
                              confirmButton: "btn primary",
                              cancelButton: "btn show-btn",
                            },
                          });
                        }
                      }}
                      className={`px-2.5 bg-gradient-to-r text-center text-white 
                        ${getDifficultyColor(difficulty, !isUnlocked).button} 
                        btn rounded-lg py-3 cursor-pointer uppercase text-center tracking-wider
                        transition-colors duration-200 shadow-md
                        ${!isUnlocked ? "opacity-90 cursor-not-allowed" : ""}`}
                    >
                      {difficulty} {!isUnlocked && "🔒"}
                    </div>

                    {activeItems.difficulty === difficulty && isUnlocked && (
                      <div className="mt-2 px-1 space-y-3">
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
                );
              })}
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
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl sm:text-3xl font-game">
                      <span className="text-yellow-400">
                        {userQuizCompleted}
                      </span>
                      <span className="text-white mx-2">of</span>
                      <span className="text-yellow-400">{totalQuizzes}</span>
                    </div>
                    <span className="text-white lg:text-lg">exercises</span>
                  </>
                )}
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
        _id: PropTypes.string,
      }),
      completed: PropTypes.bool,
    })
  ),
  onShowProgress: PropTypes.func.isRequired,
  onShowRankings: PropTypes.func.isRequired,
  onShowDailyRewards: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  completedQuizzes: PropTypes.instanceOf(Set).isRequired,
  refreshQuizProgress: PropTypes.number.isRequired,
};
