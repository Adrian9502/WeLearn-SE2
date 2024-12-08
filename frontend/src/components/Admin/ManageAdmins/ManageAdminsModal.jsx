import React, { useState, useEffect } from "react";
import api from "../../../utils/axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { IoCloseOutline } from "react-icons/io5";
import validateField from "./utils/validation";
import InputField from "./components/InputField";
//  ---- BASE API URL ----
const API_BASE_URL = "/api/admins";

// MAIN COMPONENT
const ManageAdminsModal = ({
  isOpen,
  onClose,
  type,
  onAdminCreated,
  onAdminUpdated,
  onAdminDeleted,
}) => {
  // ------ STATES ------
  const [formData, setFormData] = useState({
    adminId: "",
    fullName: "",
    username: "",
    email: "",
    password: "",
    dob: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // ------ EFFECTS ------
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  // ------ FUNCTIONS ------
  const resetForm = () => {
    setFormData({
      quizId: "",
      title: "",
      instruction: "",
      question: "",
      answer: "",
      category: "",
    });
    setErrors({});
    setTouched({});
  };
  // ------ FORM VALIDATION ------
  const validateForm = () => {
    const newErrors = {};

    // For delete operation, only validate adminId
    if (type === "delete") {
      const error = validateField("adminId", formData.adminId, type);
      if (error) newErrors.adminId = error;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    // For create/update operations, validate all required fields
    Object.keys(formData).forEach((key) => {
      // Skip password validation for update if password is empty
      if (type === "update" && key === "password" && !formData[key]) {
        return;
      }

      // Skip adminId validation for create
      if (type === "create" && key === "adminId") {
        return;
      }

      const error = validateField(key, formData[key], type);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  // INPUT CHANGE FUNCTION
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

  // BLUR FUNCTION
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // FORM SUBMIT FUNCTION
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
    // ------ API ACTIONS ------
    const apiActions = {
      create: {
        method: "POST",
        endpoint: API_BASE_URL,
        callback: onAdminCreated,
      },
      update: {
        method: "PUT",
        endpoint: `${API_BASE_URL}/${formData.adminId}`,
        callback: onAdminUpdated,
      },
      delete: {
        method: "DELETE",
        endpoint: `${API_BASE_URL}/${formData.adminId}`,
        callback: onAdminDeleted,
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
        text: `Error ${error.response?.status}: ${
          error.response?.message || "An error occurred"
        }`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // RENDER FORM INPUTS
  const renderForm = () => {
    switch (type) {
      case "create":
      case "update":
        return (
          <>
            {type === "update" && (
              // admin id
              <InputField
                label="Admin ID:"
                name="adminId"
                data-testid="adminId"
                value={formData.adminId}
                error={errors.adminId}
                onBlur={handleBlur}
                onChange={handleInputChange}
                placeholder="Enter existing admin id"
              />
            )}
            {/* full name */}
            <InputField
              label="Full Name:"
              name="fullName"
              value={formData.fullName}
              error={errors.fullName}
              onBlur={handleBlur}
              onChange={handleInputChange}
              placeholder="Enter full name"
            />
            {/* username */}
            <InputField
              label="Username:"
              name="username"
              value={formData.username}
              error={errors.username}
              onBlur={handleBlur}
              onChange={handleInputChange}
              placeholder="Enter username"
            />
            {/* email */}
            <InputField
              label="Email:"
              name="email"
              type="email"
              value={formData.email}
              error={errors.email}
              onBlur={handleBlur}
              onChange={handleInputChange}
              placeholder="Enter email"
            />
            {/* password */}
            <InputField
              label="Password:"
              name="password"
              type="password"
              value={formData.password}
              error={errors.password}
              onBlur={handleBlur}
              onChange={handleInputChange}
              placeholder="Enter password"
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
            />
            {/* birthday */}
            <InputField
              label="Birthday:"
              name="dob"
              type="date"
              value={formData.dob}
              error={errors.dob}
              onBlur={handleBlur}
              onChange={handleInputChange}
            />
          </>
        );
      case "delete":
        return (
          <InputField
            label="Admin ID:"
            name="adminId"
            value={formData.adminId}
            onChange={handleInputChange}
            placeholder="Enter admin id to delete"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{ fontFamily: "lexend" }}
      className="fixed inset-0 flex justify-center items-center z-30 bg-black bg-opacity-50"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
        <div className="rounded-xl relative bg-slate-900 text-slate-200 p-8 w-80 lg:w-96">
          <h2 className="text-xl md:text-2xl text-center font-medium mb-4">
            {type.charAt(0).toUpperCase() + type.slice(1)} Admin
          </h2>
          {/* CLOSE BUTTON */}
          <button
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
            <form role="form" onSubmit={handleSubmit}>
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

// Prop types
ManageAdminsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["create", "update", "delete"]).isRequired,
  onAdminCreated: PropTypes.func,
  onAdminUpdated: PropTypes.func,
  onAdminDeleted: PropTypes.func,
};
export default ManageAdminsModal;
