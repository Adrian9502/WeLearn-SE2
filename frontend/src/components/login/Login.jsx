import { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Blocks } from "react-loader-spinner";

export default function Login() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePopup = (admin = false, register = false) => {
    setIsAdmin(admin);
    setIsRegister(register);
    setIsPopupOpen(!isPopupOpen);
  };

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show the loading spinner
    const username = e.target.username.value;
    const password = e.target.password.value;

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

      // Log the response to verify its structure
      console.log(response);

      // Check for both user and admin depending on the login type
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
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Show the loading spinner

    const fullName = e.target.fullName.value;
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const dob = e.target.dob.value;

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

              {loading ? (
                // Render spinner while loading
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
                        type="text"
                        placeholder="Full Name"
                        required
                      />
                    </>
                  )}

                  <label htmlFor="username">
                    {isRegister ? "New Username" : "Username"}
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder={isRegister ? "New Username" : "Username"}
                    required
                  />

                  <label htmlFor="password">
                    {isRegister ? "New Password" : "Password"}
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder={isRegister ? "New Password" : "Password"}
                    required
                  />

                  {/* Confirm Password (for registration only) */}
                  {isRegister && (
                    <>
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        required
                      />
                    </>
                  )}

                  {/* Email (for registration only) */}
                  {isRegister && (
                    <>
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        required
                      />
                    </>
                  )}

                  {/* Date of Birth (for registration only) */}
                  {isRegister && (
                    <>
                      <label htmlFor="dob">Date of Birth</label>
                      <input id="dob" type="date" required />
                    </>
                  )}
                </div>
              )}

              <div className="flex justify-around">
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
