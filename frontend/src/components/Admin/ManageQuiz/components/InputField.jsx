import React from "react";
import PropTypes from "prop-types";

export default function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
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
          type={type}
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
  error: PropTypes.string,
};
