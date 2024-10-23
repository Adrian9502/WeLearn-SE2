import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ProgressBar } from "react-loader-spinner";
import PropTypes from "prop-types";
const API_BASE_URL = "http://localhost:5000/api/quizzes";

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="my-2">
    <label htmlFor={name} className="block text-lg font-semibold mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="text-gray-900 rounded-md focus:shadow-lg w-full p-2 focus:outline-none"
      placeholder={placeholder}
      required
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder }) => (
  <div className="my-2">
    <label htmlFor={name} className="block text-lg font-semibold mb-2">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="text-gray-900 rounded-md focus:shadow-lg resize-none w-full p-2 focus:outline-none"
      placeholder={placeholder}
      required
    />
  </div>
);

const Button = ({ onClick, type, className, children }) => (
  <button
    onClick={onClick}
    type={type}
    className={`rounded-md py-2 px-4 transition-colors ${className}`}
  >
    {children}
  </button>
);

const sweetAlert = ({ title, text, icon }) => {
  Swal.fire({ title, text, icon });
};
const validateForm = (formData) => {
  const { title, instruction, question, answer, category } = formData;
  if (!title || !instruction || !question || !answer || !category) {
    sweetAlert({
      title: "Error",
      text: "All fields are required.",
      icon: "error",
    });
    return false;
  }
  return true;
};

const fetchData = async ({
  validateForm,
  formData,
  resetForm,
  apiEndpoint,
  method = "POST",
  callback,
  handleCloseModal,
}) => {
  if (!validateForm(formData)) {
    return;
  }

  try {
    const response = await axios({ method, url: apiEndpoint, data: formData });
    sweetAlert({
      title: "Success!",
      text: response.data.message,
      icon: "success",
    });
    callback();
    handleCloseModal();
    resetForm();
  } catch (error) {
    sweetAlert({
      title: "Error",
      text: error.response?.data.message || "An error occurred",
      icon: "error",
    });
  }
};

const ManageQuizzesModal = ({
  isOpen,
  onClose,
  type,
  onQuizCreated,
  onQuizUpdated,
  onQuizDeleted,
}) => {
  const [formData, setFormData] = useState({
    quizId: "",
    title: "",
    instruction: "",
    question: "",
    answer: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      quizId: "",
      title: "",
      instruction: "",
      question: "",
      answer: "",
      category: "",
    });
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const apiActions = {
      create: {
        method: "POST",
        endpoint: API_BASE_URL,
        callback: onQuizCreated,
      },
      update: {
        method: "PUT",
        endpoint: `${API_BASE_URL}/${formData.quizId}`,
        callback: onQuizUpdated,
      },
      delete: {
        method: "DELETE",
        endpoint: `${API_BASE_URL}/${formData.quizId}`,
        callback: onQuizDeleted,
      },
    };

    const action = apiActions[type];

    await fetchData({
      validateForm: type === "delete" ? () => true : validateForm,
      formData,
      resetForm,
      apiEndpoint: action.endpoint,
      method: action.method,
      callback: action.callback,
      handleCloseModal: onClose,
    });

    setLoading(false);
  };

  const renderForm = () => {
    switch (type) {
      case "create":
      case "update":
        return (
          <>
            {type === "update" && (
              <InputField
                label="Quiz ID:"
                name="quizId"
                value={formData.quizId}
                onChange={handleInputChange}
                placeholder="Enter existing quiz id"
              />
            )}
            <InputField
              label="Title:"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter quiz title"
            />
            <TextAreaField
              label="Instructions:"
              name="instruction"
              value={formData.instruction}
              onChange={handleInputChange}
              placeholder="Enter quiz instructions"
            />
            <TextAreaField
              label="Question:"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="Enter quiz question"
            />
            <TextAreaField
              label="Answer:"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              placeholder="Enter quiz answer"
            />
            <div className="my-2">
              <label
                htmlFor="category"
                className="block text-lg font-semibold mb-2"
              >
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="text-gray-900 rounded-md focus:shadow-lg w-full p-2 focus:outline-none"
                required
              >
                <option value="">Select a category</option>
                <option value="Sorting Algorithm">Sorting Algorithm</option>
                <option value="Binary Algorithm">Binary Algorithm</option>
              </select>
            </div>
          </>
        );
      case "delete":
        return (
          <>
            <InputField
              label="Quiz ID:"
              name="quizId"
              value={formData.quizId}
              onChange={handleInputChange}
              placeholder="Enter quiz id to delete"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-30 bg-black bg-opacity-50">
      <div className="rounded-lg  bg-violet-700 p-8 w-96">
        <h2 className="text-3xl text-center font-bold mb-4">
          {type.charAt(0).toUpperCase() + type.slice(1)} Quiz
        </h2>
        {loading ? (
          <div className="text-center my-4">
            <div className="flex justify-center mb-5">
              <ProgressBar
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="progress-bar-loading"
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">{renderForm()}</div>
            <div className="flex justify-around mb-4">
              <Button
                type="submit"
                className={`text-white ${
                  type === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
              <Button
                onClick={onClose}
                className="text-white bg-gray-600 hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageQuizzesModal;

ManageQuizzesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["create", "update", "delete"]).isRequired,
  onQuizCreated: PropTypes.func,
  onQuizUpdated: PropTypes.func,
  onQuizDeleted: PropTypes.func,
};
TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  showPassword: PropTypes.bool,
  toggleShowPassword: PropTypes.func,
};
Button.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
