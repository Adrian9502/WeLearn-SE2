import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../User/UserContext";
import { Blocks } from "react-loader-spinner";
import { IoIosClose } from "react-icons/io";

const Forms = ({
  isRegister,
  isAdmin,
  errors,
  formError,
  setErrors,
  setFormError,
  setIsPopupOpen,
}) => {
  // context
  const { saveUser } = useUser();
  //
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [successfulRegistration, setSuccessfulRegistration] = useState(false);
  const [successfulLogin, setSuccessfulLogin] = useState(false);
  const [touched, setTouched] = useState({});

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };
  // Validation functions
  const validateLoginForm = (fields) => {
    const errors = {};

    if (!fields.username.trim()) {
      errors.username = "Username is required";
    } else if (fields.username.length < 4) {
      errors.username = "Username must be at least 4 characters";
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
    } else if (!fields.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    }

    // Email validation
    errors.email = validateEmail(fields.email);

    // Date of Birth validation
    errors.dob = validateDob(fields.dob);

    return errors;
  };

  const validateField = (value, fieldName, minLength = 0) => {
    // Basic required check
    if (!value.trim()) {
      return `${fieldName} is required`;
    }

    // Username-specific validation
    if (fieldName === "Username") {
      // Length check (6-20 char  acters)
      if (value.length < 6) {
        return "Username must be at least 6 characters";
      }
      if (value.length > 20) {
        return "Username cannot be longer than 20 characters";
      }

      // Must start with a letter
      if (!/^[a-zA-Z]/.test(value)) {
        return "Username must start with a letter";
      }

      // Can only contain letters, numbers, and underscores
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
        return "Username can only contain letters, numbers, and underscores";
      }

      // Cannot contain consecutive underscores
      if (/__/.test(value)) {
        return "Username cannot contain consecutive underscores";
      }

      // Cannot end with an underscore
      if (/_$/.test(value)) {
        return "Username cannot end with an underscore";
      }

      // Must contain at least one letter after the first character
      if (!/[a-zA-Z]/.test(value.slice(1))) {
        return "Username must contain at least one letter after the first character";
      }
    }
    // Other fields length validation
    else if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
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
    setTouched({
      username: true,
      password: true,
    });

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

    // Mark all fields as touched on submit
    const fields = [
      "fullName",
      "username",
      "email",
      "password",
      "confirmPassword",
      "dob",
    ];
    const newTouched = {};
    fields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    const { fullName, username, email, password, confirmPassword, dob } =
      e.target.elements;

    const validationErrors = validateRegisterForm({
      fullName: fullName.value,
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      dob: dob.value,
    });

    setErrors(validationErrors);

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
    }
  };

  const submitLogin = async (username, password) => {
    setLoading(true);
    setFormError(""); // Clear any previous form error

    try {
      // Define the correct endpoint based on whether it's an admin login
      const endpoint = isAdmin ? "/login/admin" : "/login/user";

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
        // this local storage are key to access different routes
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", isAdmin ? "admin" : "user"); // Save role

        if (response.data.user) {
          const userData = {
            username: response.data.user.username,
            userId: response.data.user._id,
            coins: response.data.user.coins,
          };
          saveUser(userData);
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
      const endpoint = isAdmin ? "/register/admin" : "/register/user";
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

  // Helper function to render input fields
  const renderField = (label, name, type, errorMessage) => (
    <div className="form-field relative mb-4">
      <div>
        <div className="flex items-center justify-between gap-1">
          <label htmlFor={name} className="block">
            {label}
          </label>
          {errorMessage && touched[name] && (
            <div className="error-text p-[1px] text-sm">{errorMessage}</div>
          )}
        </div>
      </div>
      <input
        data-testid={name}
        id={name}
        name={name}
        type={type}
        placeholder={label}
        className={`w-full px-3 py-2 border ${
          errorMessage && touched[name]
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        } focus:outline-none focus:ring-2 transition-colors `}
        onBlur={() => handleBlur(name)}
      />
    </div>
  );
  return (
    <form
      className="form-container relative"
      onSubmit={isRegister ? handleRegister : handleLogin}
    >
      <button
        type="button"
        onClick={() => setIsPopupOpen(false)}
        className="absolute bg-red-700 right-4 top-2 text-white hover:bg-red-600 transition-colors"
      >
        <IoIosClose size={25} />
      </button>
      <h2 className="text-center text-3xl mb-2">
        {isRegister
          ? isAdmin
            ? "Admin Registration"
            : "User Registration"
          : isAdmin
          ? "Admin Login"
          : "User Login"}
      </h2>

      {formError && (
        <div className="error-text text-sm mb-2 p-1 text-center bg-red-100">
          {formError}
        </div>
      )}
      {/* TODO: TEST THE VALIDATION AND FIX RESPONSIVENESS OF THIS LOGIN FORM */}

      {registrationMessage && (
        <div
          className={`mb-2 text-center text-lg p-3 rounded ${
            registrationMessage.toLowerCase().includes("failed")
              ? "error-text bg-red-100 border border-red-400"
              : "success-text bg-green-100 border border-green-400"
          }`}
        >
          {registrationMessage}
        </div>
      )}

      {loginMessage && (
        <div className="mb-2 text-center text-lg success-text bg-green-100 border border-green-400 p-3">
          {loginMessage}
        </div>
      )}

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
            <div className="flex flex-col space-y-2">
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

      <div className="flex justify-center items-center mt-2">
        {!successfulLogin && !successfulRegistration && (
          <>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1 text-lg bg-red-700 hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

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
