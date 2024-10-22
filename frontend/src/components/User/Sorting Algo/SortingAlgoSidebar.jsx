import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SortingAlgoSidebar() {
  const [quizzes, setQuizzes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    fetchQuizzes();
  }, []);
  const toggleQuizzes = () => {
    setIsExpanded(!isExpanded);
  };
  const fetchQuizzes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quizzes");
      const data = await response.json();

      // Filter quizzes by category
      const sortingQuizzes = data.filter(
        (quiz) => quiz.category === "Sorting Algorithm"
      );
      setQuizzes(sortingQuizzes);
      console.log(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  return (
    <aside className="sidebar min-h-screen overflow-auto">
      <div className="sidebar-icons">
        <Link to={"/user-dashboard/home"}>
          <div title="Home">
            <img src="/home.png" alt="" />
          </div>
        </Link>
        <div title="Reset Score" id="reset">
          <img src="/bin.png" alt="" />
        </div>
        <div title="Hide Sidebar" className="hide-sidebar">
          <img src="/close.png" alt="" />
        </div>
      </div>
      <div className="sidebar-content">
        <h2 className="sidebar-title text-2xl font-normal mt-5 p-2 text-center">
          SORTING ALGORITHM
        </h2>
        <div className="sidebar-info mt-5 px-3 py-4 text-center text-lg">
          Completed <br /> <span className="text-2xl">0 of 20</span> <br />
          exercises
        </div>

        {/* User container */}
        <div className="flex justify-center items-center flex-col">
          <div className="sidebar-user p-3 text-center w-fit">
            <div>
              <img src="/user.png" alt="" />
            </div>
            <span className="text-lg">user123</span>
            <button className="log-out-btn p-2">Log out</button>
          </div>
          <div className="coins">
            <div>
              <img src="/coin.gif" alt="" />
            </div>
            <span className="coins-display">Coins: 600</span>
          </div>
        </div>

        {/* Display filtered quizzes */}
        <div className="exercises-container">
          <div className=" mt-6 flex flex-col items-center justify-center">
            <div
              className="exercises w-full text-xl cursor-pointer transition-colors bubble  text-white"
              onClick={toggleQuizzes}
            >
              Bubble Sort
            </div>
            {/* Conditionally display the quizzes if expanded */}
            {isExpanded && (
              <div className="flex flex-col gap-5 mt-4">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="flex bg-sky-600 hover:bg-sky-700 transition-colors cursor-pointer exercises justify-between items-center p-2"
                  >
                    <span className="quiz-title">{quiz.title}</span>
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
