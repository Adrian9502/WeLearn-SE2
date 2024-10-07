import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Blocks } from "react-loader-spinner";

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
    return "";
  };

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return "Email is invalid";
    }
    return "";
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
    return "";
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = e.target;

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
    const { fullName, username, email, password, confirmPassword, dob } =
      e.target;

    const validationErrors = validateRegisterForm({
      fullName: fullName.value,
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      dob: dob.value,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
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
      const endpoint = isAdmin
        ? "http://localhost:5000/login/admin"
        : "http://localhost:5000/login/user";
      const response = await axios.post(endpoint, {
        username,
        password,
        isAdmin,
      });

      if (response.data && (response.data.user || response.data.admin)) {
        console.log("Login successful!");
        navigate(response.data.user ? "/user-dashboard" : "/admin-dashboard");
      } else {
        throw new Error("User or Admin object not found in response");
      }

      setIsPopupOpen(false);
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
      alert("Registration successful");
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + error.response.data.message);
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
      {formError && <div className="error-text mb-2">{formError}</div>}
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
          {isRegister && renderField("Email", "email", "email", errors.email)}
          {isRegister &&
            renderField("Date of Birth", "dob", "date", errors.dob)}
        </div>
      )}
      <div className="flex justify-around mt-2">
        <button type="submit" disabled={loading}>
          {isRegister ? "Register" : "Login"}
        </button>
        <button type="button" onClick={() => setIsPopupOpen(false)}>
          Close
        </button>
      </div>
    </form>
  );
};

// Helper function to render input fields
const renderField = (label, name, type, errorMessage) => (
  <>
    <label htmlFor={name}>{label}</label>
    <input id={name} name={name} type={type} placeholder={label} required />
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
