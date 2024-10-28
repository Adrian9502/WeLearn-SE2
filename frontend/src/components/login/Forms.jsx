import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Blocks } from "react-loader-spinner";
import React from "react";
const Forms = ({
  isRegister,
  isAdmin,
  errors,
  formError,
  setErrors,
  setFormError,
  setIsPopupOpen,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [successfulRegistration, setSuccessfulRegistration] = useState(false);
  const [successfulLogin, setSuccessfulLogin] = useState(false);

  // Validation functions
  const validateLoginForm = (fields) => {
    const errors = {};

    if (!fields.username.trim()) {
      errors.username = "Username is required";
    } else if (fields.username.length < 6) {
      errors.username = "Username must be at least 6 characters";
    } else if (/[^a-zA-Z0-9]/.test(fields.username)) {
      errors.username = "Username cannot contain special characters";
    }

    if (!fields.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const validateRegisterForm = (fields) => {
    const errors = {};

    if (!fields.fullName.trim()) {
      errors.fullName = "Full Name is required";
    } else if (fields.fullName.length < 6) {
      errors.fullName = "Full Name must be at least 6 characters";
    } else if (/[^a-zA-Z\s]/.test(fields.fullName)) {
      errors.fullName = "Full Name can only contain letters and spaces";
    }

    // Username validation
    errors.username = validateField(fields.username, "Username");

    // Password validation
    errors.password = validateField(fields.password, "Password", 6);

    // Confirm Password validation
    if (fields.password !== fields.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Email validation
    errors.email = validateEmail(fields.email);

    // Date of Birth validation
    errors.dob = validateDob(fields.dob);

    return errors;
  };

  const validateField = (value, fieldName, minLength = 0) => {
    if (!value.trim()) {
      return `${fieldName} is required`;
    } else if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    } else if (fieldName === "Username" && /[^a-zA-Z0-9]/.test(value)) {
      return `${fieldName} cannot contain special characters`;
    }
    return null;
  };

  const validateEmail = (email) => {
    const trimmedEmail = email.trim(); // Trim email input
    if (!trimmedEmail) {
      return "Email is required";
    }

    // Regex to validate standard email structure
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return "Email is invalid";
    }

    // Additional validation: Check if email ends with a number or special character after domain
    const domainPart = trimmedEmail.split("@")[1]; // Get the part after '@'
    const tld = domainPart.split(".").pop(); // Get the top-level domain part (e.g., 'com')

    if (/[0-9]$/.test(tld) || /[^a-zA-Z]$/.test(tld)) {
      return "Email cannot end with numbers or special characters";
    }

    return null; // Return null for no error
  };

  const validateDob = (dob) => {
    if (!dob) {
      return "Date of Birth is required";
    }
    const today = new Date();
    const dobDate = new Date(dob);
    const age = today.getFullYear() - dobDate.getFullYear();
    if (
      age < 10 ||
      (age === 10 &&
        today < new Date(dobDate.setFullYear(dobDate.getFullYear() + 10)))
    ) {
      return "User must be at least 10 years old";
    }
    return null;
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = e.target.elements;

    const validationErrors = validateLoginForm({
      username: username.value,
      password: password.value,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      await submitLogin(username.value, password.value);
    }
  };

  // Handle registration submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Access form elements using e.target.elements
    const fullName = e.target.elements.fullName;
    const username = e.target.elements.username;
    const email = e.target.elements.email;
    const password = e.target.elements.password;
    const confirmPassword = e.target.elements.confirmPassword;
    const dob = e.target.elements.dob;

    const validationErrors = validateRegisterForm({
      fullName: fullName.value,
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      dob: dob.value,
    });

    setErrors(validationErrors);

    // Check for validation errors: look for non-null values
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== null
    );

    if (!hasErrors) {
      await submitRegistration({
        fullName: fullName.value,
        username: username.value,
        email: email.value,
        password: password.value,
        dob: dob.value,
      });
    } else {
      console.log("Validation errors present, form not submitted");
    }
  };

  const submitLogin = async (username, password) => {
    setLoading(true);
    setFormError(""); // Clear any previous form error

    try {
      // Define the correct endpoint based on whether it's an admin login
      const endpoint = isAdmin
        ? "http://localhost:5000/login/admin"
        : "http://localhost:5000/login/user";

      const response = await axios.post(endpoint, {
        username,
        password,
        isAdmin,
      });

      if (response.data && (response.data.user || response.data.admin)) {
        setLoginMessage(
          `${isAdmin ? "Admin" : "User"} Login successful! Redirecting...`
        );

        // Save both the auth token and user role to localStorage upon successful login
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", isAdmin ? "admin" : "user"); // Save role

        // Save additional user data to localStorage if it exists
        if (response.data.user) {
          localStorage.setItem("username", response.data.user.username);
          localStorage.setItem("userId", response.data.user._id);
        }
        setSuccessfulLogin(true);

        // Redirect to the appropriate dashboard
        setTimeout(() => {
          navigate(
            response.data.user ? "/user-dashboard/home" : "/admin-dashboard/"
          );
        }, 2000); // Delay by 2 seconds
      } else {
        throw new Error("User or Admin object not found in response");
      }

      setTimeout(() => {
        setIsPopupOpen(false); // Close form after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      setFormError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitRegistration = async (formData) => {
    setLoading(true);

    try {
      const endpoint = isAdmin
        ? "http://localhost:5000/register/admin"
        : "http://localhost:5000/register/user";
      await axios.post(endpoint, { ...formData, isAdmin });

      // Set success state to true and show success message
      setSuccessfulRegistration(true);
      setRegistrationMessage(
        `${isAdmin ? "Admin" : "User"} registration successful! Please login.`
      );

      // Optional: Close form after a delay if desired
      setTimeout(() => {
        setIsPopupOpen(false); // Close form after 3 seconds
      }, 2000); // Delay by 3 seconds (optional)
    } catch (error) {
      console.error("Registration error:", error);

      setRegistrationMessage(
        "Registration failed: " +
          (error.response?.data?.message || "Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="form-container"
      onSubmit={isRegister ? handleRegister : handleLogin}
    >
      <h2 className="text-center text-3xl mb-5 p-3">
        {isRegister
          ? isAdmin
            ? "Admin Registration"
            : "User Registration"
          : isAdmin
          ? "Admin Login"
          : "User Login"}
      </h2>

      {/* Display error message if there's any */}
      {formError && <div className="error-text mb-2">{formError}</div>}

      {/* Display registration message */}
      {registrationMessage && (
        <div
          className={`mb-2 text-center text-lg ${
            registrationMessage.toLowerCase().includes("failed")
              ? "error-text"
              : "success-text"
          }`}
        >
          {registrationMessage}
        </div>
      )}

      {/* Display login message */}
      {loginMessage && (
        <div className="mb-2 text-center text-lg success-text">
          {loginMessage}
        </div>
      )}

      {/* Conditionally render the form fields only if registration is not successful */}
      {!successfulLogin && !successfulRegistration && (
        <>
          {loading ? (
            <div className="flex justify-center mb-5">
              <Blocks
                height="80"
                width="80"
                color="#FFFF00"
                ariaLabel="blocks-loading"
                visible={true}
              />
            </div>
          ) : (
            <div className="flex flex-col">
              {isRegister &&
                renderField("Full Name", "fullName", "text", errors.fullName)}
              {renderField(
                isRegister ? "New Username" : "Username",
                "username",
                "text",
                errors.username
              )}
              {renderField(
                isRegister ? "New Password" : "Password",
                "password",
                "password",
                errors.password
              )}
              {isRegister &&
                renderField(
                  "Confirm Password",
                  "confirmPassword",
                  "password",
                  errors.confirmPassword
                )}
              {isRegister &&
                renderField("Email", "email", "email", errors.email)}
              {isRegister &&
                renderField("Date of Birth", "dob", "date", errors.dob)}
            </div>
          )}
        </>
      )}

      <div className="flex justify-around mt-2">
        {/* Hide buttons if registration is successful */}
        {!successfulLogin && !successfulRegistration && (
          <>
            <button type="submit" disabled={loading}>
              {isRegister ? "Register" : "Login"}
            </button>
            <button type="button" onClick={() => setIsPopupOpen(false)}>
              Close
            </button>
          </>
        )}
      </div>
    </form>
  );
};

// Helper function to render input fields
const renderField = (label, name, type, errorMessage) => (
  <>
    <label htmlFor={name}>{label}</label>
    <input
      data-testid={name}
      id={name}
      name={name}
      type={type}
      placeholder={label}
      required
    />
    {errorMessage && <span className="error-text">{errorMessage}</span>}
  </>
);

Forms.propTypes = {
  isRegister: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  errors: PropTypes.shape({
    username: PropTypes.string,
    password: PropTypes.string,
    fullName: PropTypes.string,
    confirmPassword: PropTypes.string,
    email: PropTypes.string,
    dob: PropTypes.string,
  }),
  formError: PropTypes.string,
  setErrors: PropTypes.func.isRequired,
  setFormError: PropTypes.func.isRequired,
  setIsPopupOpen: PropTypes.func.isRequired,
};

export default Forms;
