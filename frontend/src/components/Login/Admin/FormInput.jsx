import React from "react";
import { Eye, EyeOff } from "lucide-react";
import PropTypes from "prop-types";

export default function FormInput({
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
}) {
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
}

FormInput.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.elementType,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  touched: PropTypes.bool,
  showPassword: PropTypes.bool,
  togglePassword: PropTypes.func,
};
