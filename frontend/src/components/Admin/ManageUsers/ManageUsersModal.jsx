import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { IoCloseOutline } from "react-icons/io5";
import InputField from "./components/InputField";
import validateField from "./utils/validation";
const API_BASE_URL = "/api/users";

// MAIN COMPONENT
const ManageUsersModal = ({
  isOpen,
  onClose,
  type,
  onUserCreated,
  onUserUpdated,
  onUserDeleted,
}) => {
  const [formData, setFormData] = useState({
    userId: "",
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
  // RESET FORM FUNCTION
  const resetForm = () => {
    setFormData({
      userId: "",
      fullName: "",
      username: "",
      email: "",
      password: "",
      dob: "",
    });
    setErrors({});
    setTouched({});
  };
  // EFFECTS
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;
  // FUNCTIONS
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // FORM VALIDATION
  const validateForm = () => {
    const newErrors = {};

    // For delete operation, only validate userId
    if (type === "delete") {
      const error = validateField("userId", formData.userId, type);
      if (error) newErrors.userId = error;
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    // For create/update operations, validate all required fields
    Object.keys(formData).forEach((key) => {
      // Skip password validation for update if password is empty
      if (type === "update" && key === "password" && !formData[key]) {
        return;
      }

      // Skip userId validation for create
      if (type === "create" && key === "userId") {
        return;
      }

      const error = validateField(key, formData[key], type);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        callback: onUserCreated,
      },
      update: {
        method: "PUT",
        endpoint: `${API_BASE_URL}/${formData.userId}`,
        callback: onUserUpdated,
      },
      delete: {
        method: "DELETE",
        endpoint: `${API_BASE_URL}/${formData.userId}`,
        callback: onUserDeleted,
      },
    };

    const action = apiActions[type];

    try {
      const response = await axios({
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
              // user id
              <InputField
                label="User ID:"
                name="userId"
                data-testid="userId"
                value={formData.userId}
                error={errors.userId}
                onBlur={handleBlur}
                onChange={handleInputChange}
                placeholder="Enter existing user id"
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
            label="User ID:"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            placeholder="Enter user id to delete"
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
          <h2
            data-testid="modal-title"
            className="text-xl md:text-2xl text-center font-medium mb-4"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} User
          </h2>
          <button
            data-testid="close-button"
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
                  data-testid="submit-button"
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
ManageUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["create", "update", "delete"]).isRequired,
  onUserCreated: PropTypes.func,
  onUserUpdated: PropTypes.func,
  onUserDeleted: PropTypes.func,
};

export default ManageUsersModal;
