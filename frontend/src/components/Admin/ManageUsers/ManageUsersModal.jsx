import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const API_BASE_URL = "http://localhost:5000/api/users";

// INPUT FIELD COMPONENT
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  showPassword,
  toggleShowPassword,
}) => (
  <div className="my-2">
    <label htmlFor={name} className="block mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type={name === "password" && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        className="text-gray-900 rounded-md focus:shadow-lg w-full p-2 focus:outline-none"
        placeholder={placeholder}
        required
        data-testid={name}
      />
      {name === "password" && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <FaEyeSlash className="h-5 w-5 text-purple-700" />
          ) : (
            <FaEye className="h-5 w-5 text-purple-700" />
          )}
        </button>
      )}
    </div>
  </div>
);
// BUTTON COMPONENT
const Button = ({ onClick, type, className, children }) => (
  <button
    onClick={onClick}
    type={type}
    className={`rounded-md py-2 px-4 transition-colors ${className}`}
  >
    {children}
  </button>
);
// SWEET ALERT FUNCTION
const sweetAlert = ({ title, text, icon }) => {
  Swal.fire({ title, text, icon });
};
// FORM VALIDATION
const validateForm = (formData) => {
  const { fullName, username, email, password } = formData;

  if (
    fullName.length < 5 ||
    username.length < 5 ||
    password.length < 5 ||
    !email.includes("@")
  ) {
    return false; // Invalid
  }

  return true; // Valid
};
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // FETCH DATA USING AXIOS
  const fetchData = async ({
    validateForm,
    formData,
    resetForm,
    apiEndpoint,
    method = "POST",
    callback,
    handleCloseModal,
  }) => {
    // Validate the form before making the request
    if (!validateForm(formData)) {
      return;
    }
    setLoading(true);
    try {
      // Make the API request
      const response = await axios({
        method,
        url: apiEndpoint,
        data: formData,
      });

      // Show success message
      sweetAlert({
        title: "Success!",
        text: response.data.message,
        icon: "success",
      });

      // Call the callback to refresh the data or perform any other actions
      callback();
      handleCloseModal();
      resetForm();
    } catch (error) {
      // Check if there's a response and handle the error accordingly
      if (error.response) {
        // If response is available, handle the error based on the response status
        const { status, data } = error.response;

        // If status is 404, it means the resource was not found
        if (status === 404) {
          sweetAlert({
            title: "Error",
            text: data.message || "User not found. Please check the ID.",
            icon: "error",
          });
        } else if (status === 500) {
          sweetAlert({
            title: "Error",
            text: "Invalid ID format. Please check the ID.",
            icon: "error",
          });
        } else {
          // Handle other status codes and extract error messages
          const errors = data.errors;
          const passwordError = errors
            ? errors.find((err) => err.path === "password")
            : null;
          const errorMessage = passwordError
            ? passwordError.msg
            : "An error occurred";

          sweetAlert({
            title: "Error",
            text: errorMessage,
            icon: "error",
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        sweetAlert({
          title: "Error",
          text: "No response from the server. Please try again later.",
          icon: "error",
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        sweetAlert({
          title: "Error",
          text: "An unexpected error occurred: " + error.message,
          icon: "error",
        });
      }
    } finally {
      setLoading(false); // Set loading to false after request completion
    }
  };
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
  };
  // SUBMIT FORM FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = type === "delete" || validateForm(formData); // Only validate if not deleting

    if (!isValid) {
      // Show SweetAlert or any error message here
      sweetAlert({
        title: "Error",
        text: "All fields are required and must be at least 5 characters long.",
        icon: "error",
      });

      return; // Exit the function if the form is invalid
    }

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

    await fetchData({
      validateForm: type === "delete" ? () => true : validateForm,
      formData,
      resetForm,
      apiEndpoint: action.endpoint,
      method: action.method,
      callback: action.callback,
      handleCloseModal: onClose,
    });
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
                onChange={handleInputChange}
                placeholder="Enter existing user id"
              />
            )}
            {/* full name */}
            <InputField
              label="Full Name:"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
            />
            {/* username */}
            <InputField
              label="Username:"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
            />
            {/* email */}
            <InputField
              label="Email:"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email"
            />
            {/* password */}
            <InputField
              label="Password:"
              name="password"
              type="password"
              value={formData.password}
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
      style={{ fontFamily: "Lexend" }}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
    >
      <div className="rounded-lg bg-violet-700 p-8 w-96">
        <h2 className="text-3xl text-center font-semibold mb-4">
          {type.charAt(0).toUpperCase() + type.slice(1)} User
        </h2>

        {loading ? (
          <div className="flex items-center justify-center">
            <ThreeDots
              data-testid="loading-spinner"
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
        ) : (
          <form onSubmit={handleSubmit} data-testid="modal-form">
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

// Prop types
ManageUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["create", "update", "delete"]).isRequired,
  onUserCreated: PropTypes.func,
  onUserUpdated: PropTypes.func,
  onUserDeleted: PropTypes.func,
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
  toggleShowPassword: PropTypes.func.isRequired,
};
export default ManageUsersModal;
