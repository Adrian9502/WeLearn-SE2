import { useState } from "react";

const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizInstruction, setQuizInstruction] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [errors, setErrors] = useState({});

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const validate = () => {
    const newErrors = {};

    if (!quizTitle) {
      newErrors.quizTitle = "Quiz title is required.";
    }

    if (!quizInstruction) {
      newErrors.quizInstruction = "Instructions are required.";
    }

    questions.forEach((q, index) => {
      if (!q.question) {
        newErrors[`question_${index}`] = "Question is required.";
      }
      if (!q.answer) {
        newErrors[`answer_${index}`] = "Correct answer is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return; // Stop submission if validation fails
    }

    const quizData = {
      title: quizTitle,
      instruction: quizInstruction,
      questions: questions.map((q) => ({
        question: q.question,
        answer: q.answer, // Correct answer for each question
      })),
    };

    try {
      const response = await fetch("http://localhost:5000/api/create-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        console.log("Quiz submitted successfully");
        // Optionally, reset form after success
        setQuizTitle("");
        setQuizInstruction("");
        setQuestions([{ question: "", answer: "" }]);
        setErrors({});
      } else {
        console.log("Error submitting quiz");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="circle-bg flex justify-center items-center h-screen border">
      <div className="shadow-lg custom-border px-8 w-full max-w-3xl">
        <h1 className="text-3xl uppercase yellow-text font-bold my-4 text-center">
          Create New Quiz
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Quiz Title:
            </label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full custom-border-no-bg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title"
            />
            {errors.quizTitle && (
              <p className="text-red-500 text-sm">{errors.quizTitle}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">
              Instructions:
            </label>
            <textarea
              value={quizInstruction}
              onChange={(e) => setQuizInstruction(e.target.value)}
              className="w-full resize-none custom-border-no-bg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz instructions"
            ></textarea>
            {errors.quizInstruction && (
              <p className="text-red-500 text-sm">{errors.quizInstruction}</p>
            )}
          </div>

          {questions.map((q, index) => (
            <div
              key={index}
              className="mb-6 p-3 custom-border-no-bg bg-blue-600 text-white"
            >
              <h2 className="text-lg font-semibold mb-4">
                Question {index + 1}
              </h2>

              <label className="block text-sm font-semibold mb-2">
                Question:
              </label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].question = e.target.value;
                  setQuestions(newQuestions);
                }}
                className="w-full custom-border-no-bg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the question"
              />
              {errors[`question_${index}`] && (
                <p className="text-red-500 text-sm">
                  {errors[`question_${index}`]}
                </p>
              )}

              <label className="block text-sm font-semibold mb-2">
                Correct Answer:
              </label>
              <input
                type="text"
                value={q.answer}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].answer = e.target.value;
                  setQuestions(newQuestions);
                }}
                className="w-full custom-border-no-bg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the correct answer"
              />
              {errors[`answer_${index}`] && (
                <p className="text-red-500 text-sm">
                  {errors[`answer_${index}`]}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-between mb-6">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-blue-600 text-white font-semibold custom-border-no-bg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Another Question
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-green-700 text-white font-semibold custom-border-no-bg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
