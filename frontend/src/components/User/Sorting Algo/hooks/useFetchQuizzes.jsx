import { useState, useEffect } from "react";

const useFetchQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quizzes");
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return quizzes;
};

// Usage in your component
const quizzes = useFetchQuizzes();
