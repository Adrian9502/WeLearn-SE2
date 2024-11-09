import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

const API_BASE_URL = "/api/admins";

// input validation
const validateField = (name, value, actionType) => {
  switch (name) {
    case "adminId":
      if (actionType === "create") return ""; // Skip validation for `create` action
      if (!value) return "Admin ID is required";
      if (!/^[A-Za-z0-9-_]+$/.test(value))
        return "Admin ID can only contain letters, numbers, hyphens and underscores";
      if (value.length < 3) return "Admin ID must be at least 3 characters";
      return "";

    case "fullName":
      if (!value) return "Full name is required";
      if (value.length < 2) return "Full name must be at least 2 characters";
      if (!/^[A-Za-z\s'-]+$/.test(value))
        return "Full name can only contain letters, spaces, hyphens and apostrophes";
      return "";

    case "username":
      if (!value) return "Username is required";
      if (value.length < 3) return "Username must be at least 3 characters";
      if (value.length > 30) return "Username must not exceed 30 characters";
      if (!/^[A-Za-z0-9_]+$/.test(value))
        return "Username can only contain letters, numbers and underscores";
      return "";

    case "email":
      if (!value) return "Email is required";
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address";
      return "";

    case "password":
      if (actionType === "update" && !value) return ""; // Allow empty password on update
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/(?=.*[a-z])/.test(value))
        return "Password must contain at least one lowercase letter";
      if (!/(?=.*[A-Z])/.test(value))
        return "Password must contain at least one uppercase letter";
      if (!/(?=.*\d)/.test(value))
        return "Password must contain at least one number";
      if (!/(?=.*[!@#$%^&*])/.test(value))
        return "Password must contain at least one special character (!@#$%^&*)";
      return "";

    case "dob":
      if (!value) return "Birthday is required";
      const birthDate = new Date(value);
      const today = new Date();

      if (isNaN(birthDate.getTime())) return "Please enter a valid date";
      if (birthDate > today) return "Birthday cannot be in the future";

      // Check if user is at least 13 years old
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      if (age < 13) return "User must be at least 13 years old";
      return "";

    default:
      return "";
  }
};
// INPUT FIELD COMPONENT
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  showPassword,
  toggleShowPassword,
}) => (
  <div className="relative space-y-2 mb-4">
    <div className="flex justify-between items-center">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-300"
      >
        {label}
      </label>
      {error && (
        <span className="text-xs text-red-400 ml-2 animate-fadeIn">
          {error}
        </span>
      )}
    </div>
    <div className="relative">
      <input
        id={name}
        name={name}
        // Conditionally set the type for password field
        type={name === "password" ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full
          p-2
          border-2 ${error ? "border-red-500 " : "border-slate-700"}
          placeholder-slate-400
          text-slate-950
          rounded-lg
          transition-all
          duration-200
          focus:outline-none
          focus:ring-2
          ${error ? "focus:ring-red-500/50" : "focus:ring-indigo-500"}
          hover:border-slate-600
        `}
      />
      {name === "password" && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <FaEyeSlash className="h-5 w-5 text-slate-800" />
          ) : (
            <FaEye className="h-5 w-5 text-slate-800" />
          )}
        </button>
      )}
    </div>
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
// MAIN COMPONENT
const ManageAdminsModal = ({
  isOpen,
  onClose,
  type,
  onAdminCreated,
  onAdminUpdated,
  onAdminDeleted,
}) => {
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
  // RESET FORM FUNCTION
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
  // FORM VALIDATION
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
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

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

// Prop types
ManageAdminsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["create", "update", "delete"]).isRequired,
  onAdminCreated: PropTypes.func,
  onAdminUpdated: PropTypes.func,
  onAdminDeleted: PropTypes.func,
};
Button.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
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
export default ManageAdminsModal;
