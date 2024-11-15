// Validation functions
const validateField = (name, value, context = "login", formData = {}) => {
  switch (name) {
    case "fullName":
      if (!value.trim()) return "Full Name is required";
      if (value.length < 6) return "Full Name must be at least 6 characters";
      if (!/^[a-zA-Z\s]*$/.test(value))
        return "Full Name can only contain letters and spaces";
      return null;

    case "username":
      if (!value.trim()) return "Username is required";
      if (value.length < 6) return "Username must be at least 6 characters";
      if (value.length > 20)
        return "Username cannot be longer than 20 characters";
      if (!/^[a-zA-Z]/.test(value)) return "Username must start with a letter";
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value))
        return "Username can only contain letters, numbers, and underscores";
      if (/__/.test(value))
        return "Username cannot contain consecutive underscores";
      if (/_$/.test(value)) return "Username cannot end with an underscore";
      return null;

    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email format";
      return null;

    case "password":
      // Basic validation for all contexts
      if (!value) return "Password is required";

      // Additional validation only for admin creation
      if (context === "adminCreation") {
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value))
          return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number";
        if (!/[!@#$%^&*]/.test(value))
          return "Password must contain at least one special character";
      }
      return null;

    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (value !== formData.password) return "Passwords do not match";
      return null;

    case "dob":
      if (!value) return "Date of Birth is required";
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 18) return "Admin must be at least 18 years old";
      return null;

    default:
      return null;
  }
};
export default validateField;
