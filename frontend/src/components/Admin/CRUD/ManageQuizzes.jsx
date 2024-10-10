import { useState, useEffect } from "react";
import Modal from "./Modal";
import ManageAll from "./ManageAll";
import axios from "axios";

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

  const handleCreate = (e) => {
    e.preventDefault();
    console.log("Create Quiz");
    handleCloseModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Update Quiz");
    handleCloseModal();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    console.log("Delete Quiz");
    handleCloseModal();
  };

  // Function to fetch quiz data from the API
  const fetchQuizData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/create-quiz");
      // Transform the data into the format required for the table
      const transformedData = response.data.map((quiz) => ({
        ID: quiz._id,
        Title: quiz.title,
        Instructions: quiz.instruction,
        Questions: quiz.questions
          .map((question) => question.question)
          .join(", "), // Join questions with a comma
        Answer: quiz.questions.map((question) => question.answer).join(", "), // Join answers with a comma
      }));
      setQuizData(transformedData); // Set transformed data
    } catch (err) {
      setError("Failed to fetch: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);

  // Show loading indicator or error message while fetching
  if (loading) {
    return <div>Loading...</div>;
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        type={modalType}
      />
    </>
  );
};

export default ManageQuizzes;
