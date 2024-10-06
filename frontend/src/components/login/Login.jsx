import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Blocks } from "react-loader-spinner";
import Swal from "sweetalert2";
export default function Login() {
  // state for errors
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // function to handle popup when login/register clicked
  const togglePopup = (admin = false, register = false) => {
    setIsAdmin(admin);
    setIsRegister(register);

    // If closing the popup, clear errors
    if (!isPopupOpen) {
      setErrors({}); // Reset errors when the popup is closed
    }
    // If closing the popup, clear errors
    if (!isPopupOpen) {
      setFormError(""); // Reset errors when the popup is closed
    }

    setIsPopupOpen(!isPopupOpen); // Toggle popup state
  };

  // function to handle login input errors
  const validateLoginForm = (fields) => {
    let errors = {};

    // Validate Username
    if (!fields.username.trim()) {
      errors.username = "Username is required";
    } else if (fields.username.length < 6) {
      errors.username = "Username must be at least 6 characters";
    } else if (/[^a-zA-Z0-9]/.test(fields.username)) {
      errors.username = "Username cannot contain special characters";
    }

    // Validate Password
    if (!fields.password) {
      errors.password = "Password is required";
    }

    return errors;
  };
  const validateRegisterForm = (fields) => {
    let errors = {};

    // Validate Full Name
    if (!fields.fullName.trim()) {
      errors.fullName = "Full Name is required";
    } else if (fields.fullName.length < 6) {
      errors.fullName = "Full Name must be at least 6 characters";
    } else if (/[^a-zA-Z\s]/.test(fields.fullName)) {
      errors.fullName = "Full Name can only contain letters and spaces";
    }

    // Validate Username
    if (!fields.username.trim()) {
      errors.username = "Username is required";
    } else if (fields.username.length < 6) {
      errors.username = "Username must be at least 6 characters";
    } else if (/[^a-zA-Z0-9]/.test(fields.username)) {
      errors.username = "Username cannot contain special characters";
    }

    // Validate Password
    if (!fields.password) {
      errors.password = "Password is required";
    } else if (fields.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Validate Confirm Password
    if (fields.password !== fields.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Validate Email
    if (!fields.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(fields.email)) {
      errors.email = "Email is invalid";
    }

    // Validate Date of Birth
    if (!fields.dob) {
      errors.dob = "Date of Birth is required";
    } else {
      const today = new Date();
      const dob = new Date(fields.dob);
      const age = today.getFullYear() - dob.getFullYear();
      if (
        age < 10 ||
        (age === 10 &&
          today < new Date(dob.setFullYear(dob.getFullYear() + 10)))
      ) {
        errors.dob = "User must be at least 10 years old";
      }
    }

    return errors;
  };

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    // Validate the form inputs
    const validationErrors = validateLoginForm({ username, password });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setFormError(""); // Clear any previous form error
      try {
        const response = await axios.post(
          isAdmin
            ? "http://localhost:5000/login/admin"
            : "http://localhost:5000/login/user",
          {
            username,
            password,
            isAdmin,
          }
        );

        // Check if the response contains user/admin data
        if (response.data && response.data.user) {
          alert(`Login successful: USER: ${response.data.user.fullName}`);
        } else if (response.data && response.data.admin) {
          alert(`Login successful: ADMIN: ${response.data.admin.fullName}`);
        } else {
          throw new Error("User or Admin object not found in response");
        }

        setIsPopupOpen(false);
      } catch (error) {
        console.error("Login error:", error);
        setFormError("Invalid username or password. Please try again."); // Set form error
      } finally {
        setLoading(false);
      }
    }
  };

  // function to handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    const fullName = e.target.fullName.value;
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const dob = e.target.dob.value;

    const validationErrors = validateRegisterForm({
      fullName,
      username,
      password,
      confirmPassword,
      email,
      dob,
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await axios.post(
          isAdmin
            ? "http://localhost:5000/register/admin"
            : "http://localhost:5000/register/user",
          {
            fullName,
            username,
            email,
            password,
            dob,
            isAdmin,
          }
        );
        alert("Registration successful");
        setIsPopupOpen(false);
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed: " + error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="circle-bg relative flex items-center justify-center min-h-screen">
      <div
        className="flex items-center main-container justify-center w-[60%] flex-wrap p-8"
        id="main-wrapper"
      >
        <div className="flex">
          {/* left side */}
          <div className="flex w-3/4 flex-col items-center justify-around gap-3">
            <div className="text-center text-yellow-400 tracking-wider">
              <h3 className="text-4xl leading-loose">Join the Challenge!</h3>
              <span className="leading-snug">
                Take on exciting algorithm challenges designed to teach binary
                and sorting concepts. Sign up today to track your progress and
                enhance your understanding of binary and sorting algorithms
                while improving your problem-solving skills. Are you ready?
              </span>
            </div>
            <div className="flex justify-center">
              <button
                className="btn red"
                onClick={() => togglePopup(false, false)}
              >
                LOG IN
              </button>
              <button
                className="btn blue login-button"
                onClick={() => togglePopup(false, true)}
              >
                Register
              </button>
            </div>
          </div>
          {/* right side */}
          <div className="flex w-1/2">
            <div className="text-center right-side-container text-yellow-400 tracking-wider leading-loose flex flex-col justify-around">
              <h1 className="text-3xl">
                Mastering Sorting Algorithms and Binary Operations
              </h1>
              <span className="text-sm">
                A Web-Based Game Learning System Enhancing Learning Through
                Interactive Game-Based Education
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="login-container">
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
                    color="yellow"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    visible={true}
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Full Name (for registration only) */}
                  {isRegister && (
                    <>
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        name="fullName" // Added name attribute
                        type="text"
                        placeholder="Full Name"
                        required
                      />
                      {errors.fullName && (
                        <span className="error-text">{errors.fullName}</span>
                      )}
                    </>
                  )}
                  {/* Username */}
                  <label htmlFor="username">
                    {isRegister ? "New Username" : "Username"}
                  </label>
                  <input
                    id="username"
                    name="username" // Added name attribute
                    type="text"
                    placeholder={isRegister ? "New Username" : "Username"}
                    required
                  />
                  {errors.username && (
                    <span className="error-text">{errors.username}</span>
                  )}
                  {/* Password */}
                  <label htmlFor="password">
                    {isRegister ? "New Password" : "Password"}
                  </label>
                  <input
                    id="password"
                    name="password" // Added name attribute
                    type="password"
                    placeholder={isRegister ? "New Password" : "Password"}
                    required
                  />
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                  {/* Confirm Password (for registration only) */}
                  {isRegister && (
                    <>
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword" // Added name attribute
                        type="password"
                        placeholder="Confirm Password"
                        required
                      />
                      {errors.confirmPassword && (
                        <span className="error-text">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </>
                  )}

                  {/* Email (for registration only) */}
                  {isRegister && (
                    <>
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email" // Added name attribute
                        type="email"
                        placeholder="Email"
                        required
                      />
                      {errors.email && (
                        <span className="error-text">{errors.email}</span>
                      )}
                    </>
                  )}

                  {/* Date of Birth (for registration only) */}
                  {isRegister && (
                    <>
                      <label htmlFor="dob">Date of Birth</label>
                      <input
                        id="dob"
                        name="dob" // Added name attribute
                        type="date"
                        required
                      />
                      {errors.dob && (
                        <span className="error-text">{errors.dob}</span>
                      )}
                    </>
                  )}
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
          </div>
        </div>
      )}

      <div id="bern"></div>
      <div id="bern1"></div>
      <div className="ground">
        <div className="grass"></div>
      </div>

      <div className="m-2 absolute flex flex-col items-center justify-center top-0 right-0">
        <h2 className="text-yellow-400">Admin</h2>
        <button className="btn-admin" onClick={() => togglePopup(true, false)}>
          Login
        </button>
        <button className="btn-admin" onClick={() => togglePopup(true, true)}>
          Register
        </button>
      </div>
    </main>
  );
}
