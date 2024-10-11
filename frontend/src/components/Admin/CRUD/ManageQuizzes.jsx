import { useState, useEffect, useCallback } from "react";
import ManageQuizzesModal from "../Modals/ManageQuizzesModal";
import ManageAll from "./ManageAll";
import axios from "axios";
import { Blocks } from "react-loader-spinner";

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
      <div className="flex justify-center mb-5">
        <Blocks
          height="80"
          width="80"
          color="#FFFF00"
          ariaLabel="blocks-loading"
          visible={true}
        />
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ManageAll
        title="Manage Quizzes"
        handleOpenModal={handleOpenModal}
        tableColumns={["ID", "Title", "Instructions", "Questions", "Answer"]}
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
