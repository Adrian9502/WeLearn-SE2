import React, { useState } from "react";
import "./Login.css";

export default function Login() {
  // State to control the visibility of the login and registration forms
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // New state for registration

  const togglePopup = (admin = false, register = false) => {
    setIsAdmin(admin);
    setIsRegister(register);
    setIsPopupOpen(!isPopupOpen);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    alert(`Logging in as ${isAdmin ? "Admin" : "User"}`);
    setIsPopupOpen(false); // Close the popup after login
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Handle registration logic here
    alert(`Registering ${isAdmin ? "admin" : "user"}`);
    setIsPopupOpen(false); // Close the popup after registration
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
                  <input id="email" type="email" placeholder="Email" required />
                </>
              )}

              {/* Phone Number (Optional for registration) */}
              {isRegister && (
                <>
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input id="phone" type="tel" placeholder="Phone Number" />
                </>
              )}

              {/* Date of Birth (for registration only) */}
              {isRegister && (
                <>
                  <label htmlFor="dob">Date of Birth</label>
                  <input id="dob" type="date" required />
                </>
              )}

              {/* Country/Region (for registration only) */}
              {isRegister && (
                <>
                  <label htmlFor="country">Country/Region</label>
                  <input
                    id="country"
                    type="text"
                    placeholder="Country/Region"
                    required
                  />
                </>
              )}

              <div className="flex justify-around">
                <button type="submit">
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
