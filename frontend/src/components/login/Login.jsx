import React, { useState } from "react";
import Forms from "./Forms";

const Login = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const togglePopup = (admin = false, register = false) => {
    if (!isPopupOpen) {
      setErrors({}); // Reset errors when opening the popup
      setFormError(""); // Reset form error when opening the popup
    }

    setIsAdmin(admin);
    setIsRegister(register);
    setIsPopupOpen((prevState) => !prevState); // Toggle popup state
  };

  return (
    <main
      style={{ fontFamily: "HomeVideo, Arial, Helvetica, sans-serif" }}
      className="circle-bg relative flex items-center justify-center min-h-screen"
    >
      <div
        className="flex items-center main-container justify-center w-[60%] flex-wrap p-8"
        id="main-wrapper"
      >
        <div className="flex">
          {/* Left Side */}
          <div className="flex w-3/4 flex-col items-center justify-around gap-3">
            <div className="text-center text-yellow-400 tracking-wider">
              <h3 className="text-4xl leading-loose">Join the Challenge!</h3>
              <p className="leading-snug">
                Take on exciting algorithm challenges designed to teach binary
                and sorting concepts. Sign up today to track your progress and
                enhance your understanding of binary and sorting algorithms
                while improving your problem-solving skills. Are you ready?
              </p>
            </div>
            {/* USER REGISTER/LOGIN */}
            <div className="flex justify-center">
              <button
                className="btn red"
                data-testid="user-login-button"
                onClick={() => togglePopup(false, false)}
              >
                Login
              </button>
              <button
                data-testid="user-register-button"
                className="btn blue login-button"
                onClick={() => togglePopup(false, true)}
              >
                Register
              </button>
            </div>
          </div>
          {/* Right Side */}
          <div className="flex w-1/2">
            <div className="text-center right-side-container text-yellow-400 tracking-wider leading-loose flex flex-col justify-around">
              <h1 className="text-3xl">
                Mastering Sorting Algorithms and Binary Operations
              </h1>
              <p className="text-sm">
                A Web-Based Game Learning System Enhancing Learning Through
                Interactive Game-Based Education
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="login-container">
            <Forms
              isRegister={isRegister}
              isAdmin={isAdmin}
              errors={errors}
              formError={formError}
              setErrors={setErrors}
              setFormError={setFormError}
              setIsPopupOpen={setIsPopupOpen}
            />
          </div>
        </div>
      )}
      <div id="bern"></div>
      <div id="bern1"></div>
      <div className="ground">
        <div className="grass"></div>
      </div>
      {/* ADMIN LOGIN/REGISTER */}
      <div className="m-2 absolute flex flex-col items-center justify-center top-0 right-0">
        <h2 className="text-yellow-400">Admin</h2>
        <button
          data-testid="admin-login-button"
          className="btn-admin"
          onClick={() => togglePopup(true, false)}
        >
          Login
        </button>
        <button
          className="btn-admin"
          data-testid="admin-register-button"
          onClick={() => togglePopup(true, true)}
        >
          Register
        </button>
      </div>
    </main>
  );
};

export default Login;
