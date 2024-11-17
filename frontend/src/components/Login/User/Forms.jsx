import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../User/UserContext";
import { IoIosClose } from "react-icons/io";
import { Eye, EyeOff } from "lucide-react";
import validateFormField from "./validation";

const Forms = ({
  isRegister,
  errors,
  formError,
  setErrors,
  setFormError,
  setIsPopupOpen,
}) => {
  const { saveUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [successfulRegistration, setSuccessfulRegistration] = useState(false);
  const [successfulLogin, setSuccessfulLogin] = useState(false);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    dob: "",
  });

  const handleBlur = useCallback(
    (fieldName) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
    },
    [setTouched]
  );
  const handleLoginSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const { username, password } = formData;
      const response = await axios.post("/api/login/user", {
        username,
        password,
      });
      if (response.data && response.data.user) {
        setLoginMessage("Login successful! Redirecting...");
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userRole", "user");
        if (response.data.user) {
          const userData = {
            username: response.data.user.username,
            userId: response.data.user._id,
            coins: response.data.user.coins,
          };
          saveUser(userData);
        }
        setSuccessfulLogin(true);
        setTimeout(() => {
          navigate("/user-dashboard/home");
        }, 2000);
      } else {
        throw new Error("User object not found in response");
      }
      setTimeout(() => {
        setIsPopupOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      setFormError("Invalid username or password. Try again.");
    } finally {
      setLoading(false);
    }
  }, [formData, saveUser, navigate, setIsPopupOpen, setFormError]);

  const handleRegistrationSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const { fullName, username, email, password, dob } = formData;
      await axios.post("/api/register/user", {
        fullName,
        username,
        email,
        password,
        dob,
      });
      setSuccessfulRegistration(true);
      setRegistrationMessage("Registration successful! Please login.");
      setTimeout(() => {
        setIsPopupOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setRegistrationMessage(
        "Registration failed: " +
          (error.response?.data?.message || "Unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  }, [formData, setIsPopupOpen]);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      let formDataValid = true;

      const validationErrors = {
        username: validateFormField("username", formData.username),
        password: validateFormField("password", formData.password),
        ...(isRegister && {
          fullName: validateFormField("fullName", formData.fullName),
          confirmPassword: validateFormField(
            "confirmPassword",
            formData.confirmPassword
          ),
          email: validateFormField("email", formData.email),
          dob: validateFormField("dob", formData.dob),
        }),
      };

      setErrors(validationErrors);

      Object.values(validationErrors).forEach((error) => {
        if (error) {
          formDataValid = false;
        }
      });

      if (formDataValid) {
        if (isRegister) {
          await handleRegistrationSubmit();
        } else {
          await handleLoginSubmit();
        }
      } else {
        setFormError("Error: Check the details below.");
      }
    },
    [
      formData,
      isRegister,
      setErrors,
      setFormError,
      handleRegistrationSubmit,
      handleLoginSubmit,
    ]
  );

  const renderField = useCallback(
    (label, name, type, errorMessage) => {
      const shouldShowPasswordToggle =
        type === "password" || type === "confirmPassword";

      return (
        <div className="relative mb-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <label className="tracking-widest" htmlFor={name}>
                {label}
              </label>
              {errorMessage && touched[name] && (
                <div
                  style={{ fontFamily: "lexend" }}
                  className="error-text p-1 rounded text-sm bg-yellow-400 text-red-500 font-medium"
                >
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              style={{ fontFamily: "PressStart2p" }}
              data-testid={name}
              id={name}
              name={name}
              type={shouldShowPasswordToggle && showPassword ? "text" : type}
              placeholder={label}
              className={`w-full text-slate-950 shadow-xl rounded text-sm px-3 py-2 border ${
                errorMessage && touched[name]
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 transition-colors `}
              onBlur={() => handleBlur(name)}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [name]: e.target.value }))
              }
            />
            {shouldShowPasswordToggle && (
              <button
                type="button"
                className="absolute text-slate-950 right-2 top-1/2 -translate-y-1/2 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            )}
          </div>
        </div>
      );
    },
    [handleBlur, showPassword, setShowPassword, touched]
  );
  // Check if all required fields have values
  const disableSubmit = isRegister
    ? !formData.fullName ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.email ||
      !formData.dob
    : !formData.username || !formData.password;
  // Helper function for message styling
  const getMessageStyles = (message, type = "error") => {
    const baseStyles = "mb-2 text-center p-3 text-base font-medium";
    const styles = {
      error: "bg-yellow-400 text-red-500",
      success: "success-text",
      loading: "flex justify-center items-center mb-5",
    };
    return `${baseStyles} ${styles[type]}`;
  };
  return (
    <form
      className="form-container relative bg-violet-700 w-[90%] sm:w-full md:w-[31rem] p-5 sm:p-6 md:p-9 mx-auto"
      onSubmit={handleSubmit}
    >
      {/* Close Button */}
      <button
        type="button"
        onClick={() => setIsPopupOpen(false)}
        className="absolute bg-fuchsia-500 rounded right-2 sm:right-4 top-2 text-white transition-colors hover:bg-fuchsia-600"
        aria-label="Close"
      >
        <IoIosClose size={25} />
      </button>

      {/* Form Title */}
      <h2 className="text-center p-2 text-2xl sm:text-3xl lg:text-4xl mb-2 lg:mb-5">
        {isRegister ? "Create Account" : "Login"}
      </h2>

      {/* Status Messages */}
      {registrationMessage && (
        <div
          style={
            registrationMessage.toLowerCase().includes("failed")
              ? { fontFamily: "lexend" }
              : {}
          }
          className={getMessageStyles(
            registrationMessage,
            registrationMessage.toLowerCase().includes("failed")
              ? "error"
              : "success"
          )}
        >
          {registrationMessage}
        </div>
      )}

      {formError && (
        <div
          style={{ fontFamily: "lexend" }}
          className={getMessageStyles(formError, "error")}
        >
          {formError}
        </div>
      )}

      {loginMessage && (
        <div className={getMessageStyles(loginMessage, "success")}>
          {loginMessage}
        </div>
      )}

      {/* Form Fields */}
      {!successfulLogin && !successfulRegistration && (
        <>
          {loading ? (
            <div className={getMessageStyles("", "loading")}>
              <div className="h-10 w-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {isRegister &&
                renderField(
                  "Full Name",
                  "fullName",
                  "text",
                  validateFormField("fullName", formData.fullName)
                )}

              {renderField(
                "Username",
                "username",
                "text",
                validateFormField("username", formData.username)
              )}

              {renderField(
                "Password",
                "password",
                "password",
                validateFormField("password", formData.password)
              )}

              {isRegister && (
                <>
                  {renderField(
                    "Confirm Password",
                    "confirmPassword",
                    "password",
                    validateFormField(
                      "confirmPassword",
                      formData.confirmPassword
                    )
                  )}

                  {renderField(
                    "Email",
                    "email",
                    "email",
                    validateFormField("email", formData.email)
                  )}

                  {renderField(
                    "Date of Birth",
                    "dob",
                    "date",
                    validateFormField("dob", formData.dob)
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Submit Button */}
      <div className="flex justify-center items-center mt-4 sm:mt-6">
        {!successfulLogin && !successfulRegistration && (
          <button
            type="submit"
            disabled={loading || disableSubmit}
            className="w-full sm:w-auto px-4 py-1 text-base sm:text-lg hover:scale-105 transition-all duration-200 disabled:opacity-75 disabled:hover:scale-100 login-register-btn"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        )}
      </div>
    </form>
  );
};

Forms.propTypes = {
  isRegister: PropTypes.bool.isRequired,
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
