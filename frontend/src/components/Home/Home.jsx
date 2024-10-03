import React, { useState } from "react";
import "./Home.css";

export default function Home() {
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
    alert("Registering user");
    setIsPopupOpen(false); // Close the popup after registration
  };

  return (
    // main container
    <main className="border flex items-center justify-center  min-h-screen">
      {/* title and sorting, binary container */}
      <div
        className="flex items-center justify-center w-[60%] flex-wrap p-8 border relative"
        id="main-wrapper"
      >
        {/* title */}
        <div className="mb-[10%] text-center text-yellow-400  tracking-wider leading-loose">
          <h1 className="text-5xl">
            Ready for a challenge? <br />
            Dive into the game and test your skills!
          </h1>
        </div>
        {/* buttons */}
        <div className="border flex justify-between w-full">
          <button className="btn primary" id="sorting">
            Sorting Algorithm
          </button>
          <button className="btn tertiary" id="binary">
            Binary Algorithm
          </button>
        </div>
      </div>
      {/* Buttons for user and admin login */}
      <div className="absolute right-0 top-0 border flex flex-col">
        <button
          className="btn-login-registration login-button"
          onClick={() => togglePopup(false, false)}
        >
          User Login
        </button>
        <button
          className="btn-login-registration login-button"
          onClick={() => togglePopup(true, false)}
        >
          Admin Login
        </button>
        <button
          className="btn-login-registration login-button"
          onClick={() => togglePopup(false, true)}
        >
          Register
        </button>
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
                  ? "Register"
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

      {/* bern left and right */}
      <div id="bern"></div>
      <div id="bern1"></div>
      <div className="ground">
        <div className="grass"></div>
      </div>
    </main>
  );
}
