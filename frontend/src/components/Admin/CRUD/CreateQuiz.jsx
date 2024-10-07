import { useState } from "react";

const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", answers: ["", ""] },
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answers: ["", ""] }]);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push("");
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    // Handle quiz submission logic (API call to backend)
  };

  return (
    <div className="dashboard-bg h-screen">
      <h1>Create New Quiz</h1>
      <form onSubmit={handleSubmit}>
        <label>Quiz Title:</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />

        {questions.map((q, index) => (
          <div key={index}>
            <label>Question {index + 1}:</label>
            <input
              type="text"
              value={q.question}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].question = e.target.value;
                setQuestions(newQuestions);
              }}
            />
            {q.answers.map((answer, answerIndex) => (
              <input
                key={answerIndex}
                type="text"
                value={answer}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].answers[answerIndex] = e.target.value;
                  setQuestions(newQuestions);
                }}
              />
            ))}
            <button type="button" onClick={() => handleAddAnswer(index)}>
              Add Answer
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion}>
          Add Question
        </button>
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;
