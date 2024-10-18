import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";
import PropTypes from "prop-types";

const API_BASE_URL = "http://localhost:5000/api/users";

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div className="my-2">
    <label htmlFor={name} className="block mb-2">
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

const Button = ({ onClick, type, className, children }) => (
  <button
    onClick={onClick}
    type={type}
    className={`rounded-md py-2 px-4 transition-colors ${className}`}
  >
    {children}
  </button>
);
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]), // on
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
const sweetAlert = ({ title, text, icon }) => {
  Swal.fire({ title, text, icon });
};

const validateForm = (formData) => {
  const { fullName, username, email, password, dob } = formData;
  if (
    !fullName ||
    fullName.length < 5 ||
    !username ||
    username.length < 5 ||
    !email ||
    email.length < 5 ||
    !password ||
    password.length < 5 ||
    !dob
  ) {
    sweetAlert({
      title: "Error",
      text: "All fields are required and must be at least 5 characters long.",
      icon: "error",
    });
    return false;
  }
  return true;
};

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

  // Fetch data
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
        const errors = error.response.data.errors;
        // Get the message for the password error or use a fallback message
        const passwordError = errors.find((err) => err.path === "password");
        const errorMessage = passwordError
          ? passwordError.msg
          : "An error occurred";

        sweetAlert({
          title: "Error",
          text: errorMessage,
          icon: "error",
        });
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
      setLoading(true);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
ManageUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["create", "update", "delete"]).isRequired,
  onUserCreated: PropTypes.func,
  onUserUpdated: PropTypes.func,
  onUserDeleted: PropTypes.func,
};
export default ManageUsersModal;
