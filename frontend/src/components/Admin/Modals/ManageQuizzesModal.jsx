import React, { useState, useEffect } from "react";
import axios from "axios";
import { Blocks } from "react-loader-spinner";
const ManageQuizzesModal = ({
  isOpen,
  onClose,
  handleCloseModal,
  type,
  onQuizCreated,
  onQuizUpdated,
  onQuizDeleted,
}) => {
  if (!isOpen) return null;

  const [quizId, setQuizId] = useState("");
  const [title, setTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [loading, setLoading] = useState(false);
  // Close modal when isOpen prop changes
  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);
  // reset form
  const resetForm = () => {
    setQuizId("");
    setTitle("");
    setInstruction("");
    setQuestion("");
    setAnswer("");
  };
  // show error pop up
  const showErrorPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsModalOpen(true); // Reopen modal after 1 second
    }, 1000);
  };
  // show success pop up
  const showSuccessPopup = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      handleCloseModal();
    }, 1000);
  };
  // create,read,update
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !instruction || !question || !answer) {
      showErrorPopup("All fields are required.");
      setIsModalOpen(false); // Temporarily close the modal
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/quizzes", {
        title,
        instruction,
        question,
        answer,
      });
      console.log("Quiz created:", response.data);
      onQuizCreated();
      resetForm();
      showSuccessPopup("Quiz created successfully!");
    } catch (error) {
      console.error(
        "Error creating quiz:",
        error.response?.data || error.message
      );
      showErrorPopup("Failed to create quiz. Please try again.");
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!quizId || !title || !instruction || !question || !answer) {
      showErrorPopup("All fields are required.");
      setIsModalOpen(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/quizzes/${quizId}`,
        {
          title,
          instruction,
          question,
          answer,
        }
      );
      console.log("Quiz updated:", response.data);
      onQuizUpdated();
      resetForm();
      showSuccessPopup("Quiz updated successfully!");
    } catch (error) {
      console.error(
        "Error updating quiz:",
        error.response?.data || error.message
      );
      showErrorPopup("Failed to update quiz. Please try again.");
      setIsModalOpen(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!quizId) {
      showErrorPopup("Quiz ID is required.");
      setIsModalOpen(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/quizzes/${quizId}`
      );
      console.log("Quiz deleted:", response.data);
      onQuizDeleted();
      resetForm();
      showSuccessPopup("Quiz deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting quiz:",
        error.response?.data || error.message
      );
      showErrorPopup("Failed to delete quiz. Please try again.");
      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center p-3">
          {popupMessage}
        </div>
      )}
      {isModalOpen && (
        <div className="custom-border p-8 w-96">
          <h2 className="text-3xl yellow-text text-center font-bold mb-4">
            {type === "create" && "Create Quiz"}
            {type === "update" && "Update Quiz"}
            {type === "delete" && "Delete Quiz"}
          </h2>
          {loading && (
            <div className="text-center my-4">
              <div className="flex justify-center mb-5">
                <Blocks
                  height="80"
                  width="80"
                  color="#FFFF00"
                  ariaLabel="blocks-loading"
                  visible={true}
                />
              </div>
            </div>
          )}
          {/* Create Form */}
          {!loading && type === "create" && (
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <div className="my-2">
                  <label className="block text-lg font-semibold mb-2">
                    Quiz Title:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-gray-900 border-input w-full p-2 focus:outline-none"
                    placeholder="Enter new quiz title"
                    required
                  />
                </div>
                <div className="my-2">
                  <label className="block text-lg font-semibold mb-2">
                    Instructions:
                  </label>
                  <textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                    placeholder="Enter new quiz instructions"
                    required
                  ></textarea>
                </div>
                <div className="my-2">
                  <label className="block text-lg font-semibold mb-2">
                    Quiz Question:
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                    placeholder="Enter new quiz question"
                    required
                  ></textarea>
                </div>
                <div className="my-2">
                  <label className="block text-lg font-semibold mb-2">
                    Answer:
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                    placeholder="Enter answer"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <button
                  type="submit"
                  className="text-white custom-border-no-bg px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={onClose}
                  className="text-white custom-border py-2 px-4 bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </form>
          )}

          {/* Update Form */}
          {!loading && type === "update" && (
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <div className="my-2">
                  <label className="block text-lg font-semibold mb-2">
                    Quiz ID:
                  </label>
                  <input
                    type="text"
                    value={quizId}
                    onChange={(e) => setQuizId(e.target.value)}
                    className="text-gray-900 border-input w-full p-2 focus:outline-none"
                    placeholder="Enter quiz id to update"
                    required
                  />
                </div>
                <div className="my-2">
                  <label className="block text-lg font-semibold mb-2">
                    Quiz Title:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-gray-900 border-input w-full p-2 focus:outline-none"
                    placeholder="Enter quiz title"
                  />
                </div>
                <div className="my-2">
                  <label className="block text-lg font-semibold mb-2">
                    Instructions:
                  </label>
                  <textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                    placeholder="Enter instructions"
                  ></textarea>
                </div>
                <div className="my-2">
                  <label className="block text-lg font-semibold mb-2">
                    Quiz Question:
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                    placeholder="Enter quiz question"
                  ></textarea>
                </div>
                <div className="my-2">
                  <label className="block text-lg font-semibold mb-2">
                    Answer:
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="text-gray-900 resize-none border-input w-full p-2 focus:outline-none"
                    placeholder="Enter answer"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <button
                  type="submit"
                  className="text-white custom-border-no-bg px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={onClose}
                  className="text-white custom-border py-2 px-4 bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </form>
          )}

          {/* Delete Form */}
          {!loading && type === "delete" && (
            <form onSubmit={handleDelete}>
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Quiz ID:
                </label>
                <input
                  type="text"
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  className="text-gray-900 border-input w-full p-2 focus:outline-none"
                  placeholder="Enter quiz id to delete"
                  required
                />
              </div>
              <div className="flex justify-between mb-4">
                <button
                  type="submit"
                  className="custom-border py-2 px-4 bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={onClose}
                  className="custom-border py-2 px-4 bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageQuizzesModal;
