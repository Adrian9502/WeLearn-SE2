import { useEffect, useState } from "react";

const ManageQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch quizzes from API
    fetch("/api/quizzes")
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  return (
    <div className="bg-black flex text-white">
      <div className="p-10">
        <h1>Manage Quizzes</h1>
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <h2>{quiz.title}</h2>
              <p>{quiz.questions.length} questions</p>
              <button>Edit</button>
              <button>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageQuiz;
