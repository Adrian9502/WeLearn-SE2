import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ProgressBar } from "react-loader-spinner";
const ManageQuizzesModal = ({
  isOpen,
  onClose,
  handleCloseModal,
  type,
  onQuizCreated,
  onQuizUpdated,
  onQuizDeleted,
}) => {
  const [quizId, setQuizId] = useState("");
  const [title, setTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [loading, setLoading] = useState(false);

  // Close modal when isOpen prop changes
  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);
  if (!isOpen) return null;

  const sweetAlert = ({ title, text, icon }) => {
    Swal.fire({
      title: title, // Pass the title directly
      text: text, // Pass the text directly
      icon: icon, // Pass the icon directly
    });
  };

  // reset form
  const resetForm = () => {
    setQuizId("");
    setTitle("");
    setInstruction("");
    setQuestion("");
    setAnswer("");
  };
  // create,read,update
  const handleCreate = async (e) => {
    e.preventDefault();
    if (
      !title ||
      title.length < 5 ||
      !instruction ||
      instruction.length < 10 ||
      !question ||
      question.length < 10 ||
      !answer ||
      answer.length < 5
    ) {
      sweetAlert({
        title: "Error",
        text: "All fields are required and must be at least 10 characters long.",
        icon: "error",
      });
      resetForm();
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
      // pop up alert
      sweetAlert({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });
      onQuizCreated();
      handleCloseModal();
      resetForm();
    } catch (error) {
      console.error(
        "Error creating quiz:",
        error.response?.data || error.message
      );
      // pop up alert
      sweetAlert({
        title: "Error",
        text: error.message,
        icon: "error",
      });

      setIsModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !title ||
      title.length < 5 ||
      !instruction ||
      instruction.length < 10 ||
      !question ||
      question.length < 10 ||
      !answer ||
      answer.length < 5
    ) {
      sweetAlert({
        title: "Error",
        text: "All fields are required and must be at least 10 characters long.",
        icon: "error",
      });
      resetForm();
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
      // pop up alert
      sweetAlert({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });
      onQuizUpdated();
      resetForm();
      handleCloseModal();
    } catch {
      // pop up alert
      sweetAlert({
        title: "Error",
        text: "Cannot update, invalid ID",
        icon: "error",
      });
      // handleCloseModal();
      resetForm();
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    // set loading to true
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/quizzes/${quizId}`
      );

      // pop up alert
      sweetAlert({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });
      handleCloseModal();
      onQuizDeleted();
      resetForm();
    } catch (error) {
      // pop up alert
      sweetAlert({
        title: "Error",
        text: `Invalid ID or ID does not exist`,
        icon: "error",
      });
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      {isModalOpen && (
        <div className="rounded-lg bg-violet-700 p-8 w-96">
          <h2 className="text-3xl text-center font-bold mb-4">
            {type === "create" && "Create Quiz"}
            {type === "update" && "Update Quiz"}
            {type === "delete" && "Delete Quiz"}
          </h2>
          {loading && (
            <div className="text-center my-4">
              <div className="flex justify-center mb-5">
                <ProgressBar
                  visible={true}
                  height="80"
                  width="80"
                  color="#4fa94d"
                  ariaLabel="progress-bar-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
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
                    className="text-gray-900 rounded-md focus:shadow-lg w-full p-2 focus:outline-none"
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
                    className="text-gray-900 rounded-md focus:shadow-lg resize-none  w-full p-2 focus:outline-none"
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
                    className="text-gray-900 rounded-md focus:shadow-lg resize-none w-full p-2 focus:outline-none"
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
                    className="text-gray-900 rounded-md focus:shadow-lg resize-none  w-full p-2 focus:outline-none"
                    placeholder="Enter answer"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-around mb-4">
                <button
                  type="submit"
                  className="text-white px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={onClose}
                  className="text-white rounded-md py-2 px-4 bg-gray-600 hover:bg-gray-700 transition-colors"
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
                    className="text-gray-900 rounded-md focus:shadow-lg  w-full p-2 focus:outline-none"
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
                    className="text-gray-900 rounded-md focus:shadow-lg  w-full p-2 focus:outline-none"
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
                    className="text-gray-900 rounded-md focus:shadow-lg resize-none  w-full p-2 focus:outline-none"
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
                    className="text-gray-900 rounded-md focus:shadow-lg resize-none  w-full p-2 focus:outline-none"
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
                    className="text-gray-900 rounded-md focus:shadow-lg resize-none  w-full p-2 focus:outline-none"
                    placeholder="Enter answer"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-around mb-4">
                <button
                  type="submit"
                  className="text-white rounded-md px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={onClose}
                  className="text-white rounded-md py-2 px-4 bg-gray-600 hover:bg-gray-700 transition-colors"
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
                  className="text-gray-900 rounded-md focus:shadow-lg w-full p-2 focus:outline-none"
                  placeholder="Enter quiz id to delete"
                  required
                />
              </div>
              <div className="flex justify-around mb-4">
                <button
                  type="submit"
                  className="rounded-md py-2 px-4 bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={onClose}
                  className="rounded-md py-2 px-4 bg-gray-600 text-white hover:bg-gray-700 transition-colors"
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
