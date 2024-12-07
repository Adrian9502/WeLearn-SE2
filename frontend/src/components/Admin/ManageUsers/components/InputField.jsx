import React from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  showPassword,
  toggleShowPassword,
}) {
  return (
    <div className="relative space-y-2 mb-4">
      <div className="flex justify-between items-center">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
        {error && (
          <span className="text-xs text-red-400 ml-2 animate-fadeIn">
            {error}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          id={name}
          name={name}
          data-testid={name}
          // Conditionally set the type for password field
          type={
            name === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
          w-full
          p-2
          border-2 ${error ? "border-red-500 " : "border-slate-700"}
          placeholder-slate-400
          text-slate-950
          rounded-lg
          transition-all
          duration-200
          focus:outline-none
          focus:ring-2
          ${error ? "focus:ring-red-500/50" : "focus:ring-indigo-500"}
          hover:border-slate-600
        `}
        />
        {name === "password" && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5 text-slate-800" />
            ) : (
              <FaEye className="h-5 w-5 text-slate-800" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  showPassword: PropTypes.bool,
  toggleShowPassword: PropTypes.func,
  error: PropTypes.string,
};
