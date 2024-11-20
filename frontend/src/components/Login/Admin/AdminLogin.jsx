import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../User/UserContext";
import Swal from "sweetalert2";
import axios from "axios";
import validateField from "./admin-validation";
import {
  User,
  Mail,
  Shield,
  Lock,
  Star,
  Calendar,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

const FormInput = ({
  type = "text",
  name,
  placeholder,
  icon: Icon,
  value,
  onChange,
  onBlur,
  error,
  touched,
  showPassword,
  togglePassword,
}) => {
  const isPasswordField = type === "password";

  return (
    <div className="space-y-1">
      {/* Container for input and error */}
      <div className="relative">
        {/* Separate container for input and icons */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>
        )}
        <input
          type={isPasswordField && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`block w-full ${Icon ? "pl-10" : "pl-3"} pr-${
            isPasswordField ? "10" : "3"
          } py-2 rounded-md bg-slate-700 text-white border ${
            error && touched ? "border-red-500" : "border-slate-600"
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
            ) : (
              <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
            )}
          </button>
        )}
      </div>
      {/* Error message in separate div */}
      {error && touched && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  // context
  const { saveUser } = useUser();
  //
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [containerHeight, setContainerHeight] = useState("auto");
  useEffect(() => {
    const container = document.querySelector(".form-container-admin");
    if (container) {
      setContainerHeight(`${container.scrollHeight}px`);
    }
  }, [isLogin]);
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "WeLearn - Admin";

    return () => {
      document.title = originalTitle;
    };
  }, []);

  const handleModeSwitch = () => {
    setIsAnimating(true);
    setFormData({
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
    });
    setRegistrationMessage("");
    setLoginMessage("");
    setTouched({});
    setErrors({});
    // Calculate and set the initial height before transition
    const container = document.querySelector(".form-container-admin");
    if (container) {
      setContainerHeight(`${container.scrollHeight}px`);
    }

    setTimeout(() => {
      setIsLogin(!isLogin);
    }, 300);

    // Update height after content changes
    setTimeout(() => {
      const container = document.querySelector(".form-container-admin");
      if (container) {
        setContainerHeight(`${container.scrollHeight}px`);
      }
      setIsAnimating(false);
    }, 600);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get relevant fields based on login mode
    const relevantFields = isLogin
      ? ["username", "password"]
      : ["fullName", "username", "email", "password", "confirmPassword", "dob"];

    // Validate only relevant fields
    const newErrors = {};
    relevantFields.forEach((key) => {
      const error = validateField(
        key,
        formData[key],
        isLogin ? "login" : "adminCreation",
        formData
      );
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(
      relevantFields.reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Create payload with only relevant fields
        const payload = relevantFields.reduce(
          (acc, key) => ({
            ...acc,
            [key]: formData[key],
          }),
          {}
        );
        const endpoint = isLogin ? "/api/login/admin" : "/api/register/admin";
        const response = await axios.post(endpoint, payload);

        if (isLogin) {
          // Handle successful login
          saveUser(response.data);

          // Save both the auth token and user role to localStorage upon successful login
          // this local storage are key to access different routes
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("userRole", "admin"); // Save role
          localStorage.setItem("username", response.data.admin.username);
          Swal.fire({
            title: "Login Successful!",
            html: "Redirecting...",
            timer: 1500,
            icon: "success",
            background: "#1e293b",
            color: "#fff",
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
          }).then(() => {
            navigate("/admin-dashboard");
          });
        } else {
          setRegistrationMessage("Registration successful! Please login.");
          // Reset form after successful registration
          setFormData({
            fullName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            dob: "",
          });
        }
      } catch (error) {
        if (error.response) {
          // Handle specific HTTP error codes
          switch (error.response.status) {
            case 404:
              setLoginMessage(
                error.response?.data?.message ||
                  `${isLogin ? "Username not found" : "Registration failed"}`
              );
              break;
            case 400:
              setLoginMessage(
                error.response?.data?.message ||
                  "Bad request. Please check the provided details."
              );
              break;
            case 500:
              setLoginMessage(
                error.response?.data?.message ||
                  "Server error. Please try again later."
              );
              break;
            default:
              setLoginMessage(
                error.response?.data?.message ||
                  "An error occurred. Please try again."
              );
              break;
          }
        } else {
          setRegistrationMessage(
            "Network error. Please check your connection."
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };
  const handleBack = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be redirected to the home page.",
      icon: "warning",
      showCancelButton: true,
      background: "#1e293b", // Dark background
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      color: "#fff", // White text
      confirmButtonText: "Yes, go to home",
      cancelButtonText: "No, stay here",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  };

  const inputFields = [
    ...(isLogin
      ? []
      : [
          {
            name: "fullName",
            type: "text",
            placeholder: "Full Name",
            icon: User,
          },
          {
            name: "email",
            type: "email",
            placeholder: "Email Address",
            icon: Mail,
          },
          {
            name: "dob",
            type: "date",
            placeholder: "Date of Birth",
            icon: Calendar,
          },
        ]),
    {
      name: "username",
      type: "text",
      placeholder: "Username",
      icon: User,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      icon: Lock,
      showPassword,
      togglePassword: () => setShowPassword(!showPassword),
    },
    ...(isLogin
      ? []
      : [
          {
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm Password",
            icon: Lock,
            showPassword: showConfirmPassword,
            togglePassword: () => setShowConfirmPassword(!showConfirmPassword),
          },
        ]),
  ];
  return (
    <div
      style={{ fontFamily: "lexend" }}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 md:p-6"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      {/* main container */}
      <div className="w-full max-w-6xl transition-all duration-300 flex flex-col items-center lg:flex-row p-3 gap-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800">
        {/* Title Section */}

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-9 space-y-8">
          {/* Admin Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-400 text-sm font-medium">
              Admin Portal
            </span>
          </div>

          {/* Main Title */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-5xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  WeLearn
                </span>
              </h1>
              <p className="text-lg text-indigo-300 font-semibold">
                Administrative Dashboard
              </p>
            </div>
            <p className="text-slate-400 text-sm md:text-base lg:text-lg max-w-md mx-auto leading-relaxed">
              An interactive web-based game learning system designed to help
              students learn sorting algorithms and binary operations.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {[
              {
                icon: Lock,
                title: "Secure Access",
                desc: "Enhanced security protocols",
              },
              {
                icon: Star,
                title: "Full Control",
                desc: "Manage Users, Quizzes and more",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4  bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <feature.icon className="w-6 h-6 text-indigo-400 mb-2" />
                <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
            <button
              onClick={handleBack}
              className="bg-slate-800 hover:bg-slate-900 transition text-xs p-2 text-white rounded-lg"
            >
              Back to home
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-4 md:p-6 lg:p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
          <div
            className={`relative max-w-md mx-auto overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] transition-all ${
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="relative rounded-xl bg-slate-950 p-4 md:p-6 space-y-6">
              {/* Form Header */}
              <div
                className={`text-center transition-all duration-300 ease-in-out ${
                  isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {isLogin ? "Admin Login" : "Create Admin Account"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {isLogin
                    ? "Enter your admin credentials to access your account"
                    : "Register for administrative dashboard access"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="text-red-500 text-center">{loginMessage}</div>
                <div className="text-green-500 text-center">
                  {registrationMessage}
                </div>
                {inputFields.map((field) => (
                  <FormInput
                    key={field.name}
                    {...field}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur(field.name)}
                    error={errors[field.name]}
                    touched={touched[field.name]}
                  />
                ))}

                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
                  disabled={loading}
                >
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {loading ? (
                    <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-indigo-500"></div>
                  ) : (
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  )}
                </button>
              </form>

              {/* Mode Switch Button */}
              <div className="text-center">
                <button
                  onClick={handleModeSwitch}
                  className={`text-sm text-blue-400 hover:text-blue-300 transition-all duration-300 ease-in-out hover:scale-105 ${
                    isAnimating
                      ? "opacity-0 -translate-x-4"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  {isLogin
                    ? "Need an admin account? Register"
                    : "Already have an admin account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
