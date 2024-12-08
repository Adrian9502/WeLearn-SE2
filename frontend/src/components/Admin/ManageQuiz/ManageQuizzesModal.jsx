import React, { useState, useEffect } from "react";

import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { IoCloseOutline } from "react-icons/io5";
import validateField from "./utils/validation";
import InputField from "./components/InputField";
import TextAreaField from "./components/TextAreaField";
import api from "../../../utils/axios";
// ---- BASE API URL ----
const API_BASE_URL = "/api/quizzes";

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
    instructions: "",
    questions: "",
    answer: "",
    type: "",
    difficulty: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const resetForm = () => {
    setFormData({
      quizId: "",
      title: "",
      instructions: "",
      questions: "",
      answer: "",
      type: "",
      difficulty: "",
      category: "",
    });
    setErrors({});
    setTouched({});
  };
  // validate form function
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (type === "delete" && key !== "quizId") return;
      const error = validateField(key, formData[key], type);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    // Validate field on change if it's been touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {}
    );
    setTouched(allTouched);

    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error",
        background: "#1e293b", // Dark background
        color: "#fff", // White text
        customClass: {
          popup: "border border-slate-700",
        },
        text: "Please check all fields and try again",
        icon: "error",
      });
      return;
    }

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

    try {
      const response = await api({
        method: action.method,
        url: action.endpoint,
        data: formData,
      });

      Swal.fire({
        title: "Success!",
        background: "#1e293b", // Dark background
        color: "#fff", // White text
        customClass: {
          popup: "border border-slate-700",
        },
        text: response.data.message,
        icon: "success",
      });

      action.callback();
      onClose();
      resetForm();
    } catch (error) {
      Swal.fire({
        title: "Error",
        background: "#1e293b", // Dark background
        color: "#fff", // White text
        customClass: {
          popup: "border border-slate-700",
        },
        text: error.response?.data.message || "An error occurred",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (type) {
      case "create":
      case "update":
        return (
          <>
            {type === "update" && (
              <InputField
                label="Quiz ID"
                name="quizId"
                value={formData.quizId}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter existing quiz id"
                error={errors.quizId}
              />
            )}
            <InputField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter quiz title"
              error={errors.title}
            />
            <TextAreaField
              label="Instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter quiz instructions"
              error={errors.instructions}
            />
            <TextAreaField
              label="Question"
              name="questions"
              value={formData.questions}
              onChange={handleInputChange}
              rows={4}
              onBlur={handleBlur}
              placeholder="Enter quiz question"
              error={errors.questions}
            />
            <TextAreaField
              label="Answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter quiz answer"
              error={errors.answer}
            />
            <div className="relative space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-slate-300"
                >
                  Type
                </label>
                {errors.type && (
                  <span className="text-xs text-red-400 ml-2 animate-fadeIn">
                    {errors.type}
                  </span>
                )}
              </div>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`
                w-full p-2 rounded-lg
                border-2 ${errors.type ? "border-red-500" : "border-slate-700"}
                text-slate-950
                focus:outline-none focus:ring-2
                ${
                  errors.type
                    ? "focus:ring-red-500/50"
                    : "focus:ring-indigo-500"
                }
              `}
              >
                <option value="">Select quiz type</option>
                {/* Sorting Algorithms */}
                <option value="Bubble Sort">Bubble Sort</option>
                <option value="Insertion Sort">Insertion Sort</option>
                <option value="Merge Sort">Merge Sort</option>
                <option value="Selection Sort">Selection Sort</option>
                {/* Binary Operations */}
                <option value="Addition">Addition</option>
                <option value="Subtraction">Subtraction</option>
                <option value="Multiplication">Multiplication</option>
                <option value="Alphabet">Alphabet</option>
              </select>
            </div>

            <div className="relative space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-slate-300"
                >
                  Difficulty
                </label>
                {errors.difficulty && (
                  <span className="text-xs text-red-400 ml-2 animate-fadeIn">
                    {errors.difficulty}
                  </span>
                )}
              </div>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`
                w-full p-2 rounded-lg
                border-2 ${
                  errors.difficulty ? "border-red-500" : "border-slate-700"
                }
                text-slate-950
                focus:outline-none focus:ring-2
                ${
                  errors.difficulty
                    ? "focus:ring-red-500/50"
                    : "focus:ring-indigo-500"
                }
              `}
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="relative space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-slate-300"
                >
                  Category
                </label>
                {errors.category && (
                  <span className="text-xs text-red-400 ml-2 animate-fadeIn">
                    {errors.category}
                  </span>
                )}
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`
                w-full p-2 rounded-lg
                border-2 ${
                  errors.category ? "border-red-500" : "border-slate-700"
                }
                text-slate-950
                focus:outline-none focus:ring-2
                ${
                  errors.category
                    ? "focus:ring-red-500/50"
                    : "focus:ring-indigo-500"
                }
              `}
              >
                <option value="">Select category</option>
                <option value="Sorting Algorithms">Sorting Algorithms</option>
                <option value="Binary Operations">Binary Operations</option>
              </select>
            </div>
          </>
        );
      case "delete":
        return (
          <InputField
            label="Quiz ID"
            name="quizId"
            value={formData.quizId}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter quiz id to delete"
            error={errors.quizId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{ fontFamily: "lexend" }}
      className="fixed inset-0 flex justify-center items-center px-5 z-30 bg-black bg-opacity-50"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
        <div className="rounded-xl relative bg-slate-900 text-slate-200 p-8 w-full lg:w-96">
          <h2 className="text-xl md:text-2xl text-center font-medium mb-4">
            {type.charAt(0).toUpperCase() + type.slice(1)} Quiz
          </h2>
          <button
            data-testid="close-modal-button"
            onClick={onClose}
            className="text-white absolute right-4 top-4"
          >
            <IoCloseOutline size={20} />
          </button>
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>{renderForm()}</div>
              <div className="flex justify-around">
                <button
                  type="submit"
                  className={`rounded-md py-2 px-4 text-white bg-gradient-to-l ${
                    type === "delete"
                      ? "from-orange-600 to-red-500"
                      : "from-emerald-600 to-green-600"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              </div>
            </form>
          )}
        </div>
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
