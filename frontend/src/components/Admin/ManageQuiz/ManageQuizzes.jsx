import { useState, useEffect, useCallback } from "react";
import ManageQuizzesModal from "./ManageQuizzesModal";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import QuizDashboardManager from "./QuizDashboardManager";

const ManageQuizzes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to fetch quiz data from the API
  const fetchQuizData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/quizzes");
      const transformedData = response.data.map((quiz) => ({
        ID: quiz._id,
        Title: quiz.title,
        Instructions: quiz.instruction,
        Questions: quiz.question,
        Answer: quiz.answer,
        Category: quiz.category,
      }));
      setQuizData(transformedData);
    } catch (err) {
      setError("Failed to fetch: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  // Callback functions for CRUD operations
  const handleQuizCreated = useCallback(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleQuizUpdated = useCallback(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleQuizDeleted = useCallback(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center mb-5">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#6d28d9"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col text-2xl font-semibold text-slate-800 h-screen items-center justify-center mb-5">
        <h2>Something went wrong.</h2>
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <>
      <QuizDashboardManager
        title="Manage Quizzes"
        handleOpenModal={handleOpenModal}
        tableColumns={[
          "ID",
          "Title",
          "Instructions",
          "Questions",
          "Answer",
          "Category",
        ]}
        tableRows={quizData}
      />
      <ManageQuizzesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleCloseModal={handleCloseModal}
        type={modalType}
        onQuizCreated={handleQuizCreated}
        onQuizUpdated={handleQuizUpdated}
        onQuizDeleted={handleQuizDeleted}
      />
    </>
  );
};
export default ManageQuizzes;
