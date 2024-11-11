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
      setErrors({});
      setFormError("");
    }
    setIsAdmin(admin);
    setIsRegister(register);
    setIsPopupOpen((prevState) => !prevState);
  };

  return (
    <main
      style={{ fontFamily: "HomeVideo, Arial, Helvetica, sans-serif" }}
      className="bg-gradient-to-b from-[#622aff] to-[#622aff]/90 custom-cursor min-h-screen pt-4"
    >
      <img src="" alt="" />
      <img src="" alt="" />
      <img src="" alt="" />
      {/* LOGO */}
      <img
        src="/landing-page-logo.png"
        className="w-[15%] mt-4 mx-auto pointer-events-none"
        alt="WeLearn logo"
      />

      {/* main container */}
      <div className="relative flex items-center justify-center min-h-[calc(100vh)]">
        {/* Text and user login/register */}
        <div
          className="flex items-center justify-center mx-auto mb-32 w-full lg:w-[60%] flex-wrap p-4 lg:p-8"
          id="main-wrapper"
        >
          <div className="text-center tracking-wider px-4">
            <h3 className="text-2xl mb-10 kemco-font font-outline text-white md:text-4xl lg:text-5xl leading-loose">
              Sharpen your skills <br /> and test your knowledge
            </h3>
            <p className="leading-snug DePixelKlein text-white lg:text-xl text-base">
              Join exciting algorithm challenges to master binary and sorting
              concepts. Sign up now to track progress and boost your
              problem-solving skills!
            </p>
          </div>
          {/* USER REGISTER/LOGIN */}
          <div className="flex justify-center mt-10 gap-14">
            <button
              className="text-sm hover:scale-105 transition-transform md:text-xl login-register-btn"
              data-testid="user-login-button"
              onClick={() => togglePopup(false, false)}
            >
              Login
            </button>
            <button
              data-testid="user-register-button"
              className="login-register-btn hover:scale-105 transition-transform text-sm md:text-xl"
              onClick={() => togglePopup(false, true)}
            >
              Register
            </button>
          </div>
        </div>
        {/* Mountain image */}
        <div className="ground-repeat ground-repeat-with-gradient absolute bottom-0 w-full border h-80 pointer-events-none"></div>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="login-container border items-center justify-center max-w-[90%] md:max-w-[80%] lg:max-w-none">
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

      {/* ADMIN LOGIN/REGISTER */}
      <div className="m-2 absolute border flex flex-col items-center justify-center top-0 right-0">
        <h2 className="text-yellow-400 text-sm md:text-base">Admin</h2>
        <button
          data-testid="admin-login-button"
          className="btn-admin text-xs md:text-sm"
          onClick={() => togglePopup(true, false)}
        >
          Login
        </button>
        <button
          className="btn-admin text-xs md:text-sm"
          data-testid="admin-register-button"
          onClick={() => togglePopup(true, true)}
        >
          Register
        </button>
      </div>

      <div className="h-96 bg-gradient-to-b from-[#622aff] to-[#622aff]/90 relative text-white">
        <div className="absolute top-0 w-full h-40 pixels"></div>
      </div>
    </main>
  );
};

export default Login;
