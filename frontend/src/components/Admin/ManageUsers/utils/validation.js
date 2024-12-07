const validateField = (name, value, actionType) => {
  switch (name) {
    case "userId":
      if (actionType === "create") return ""; // Skip validation for `create` action
      if (!value) return "User ID is required";
      if (!/^[A-Za-z0-9-_]+$/.test(value))
        return "User ID can only contain letters, numbers, hyphens and underscores";
      if (value.length < 3) return "User ID must be at least 3 characters";
      return "";

    case "fullName":
      if (!value) return "Full name is required";
      if (value.length < 2) return "Full name must be at least 2 characters";
      if (!/^[A-Za-z\s'-]+$/.test(value))
        return "Full name can only contain letters, spaces, hyphens and apostrophes";
      return "";

    case "username":
      if (!value) return "Username is required";
      if (value.length < 3) return "Username must be at least 3 characters";
      if (value.length > 30) return "Username must not exceed 30 characters";
      if (!/^[A-Za-z0-9_]+$/.test(value))
        return "Username can only contain letters, numbers and underscores";
      return "";

    case "email":
      if (!value) return "Email is required";
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Please enter a valid email address";
      return "";

    case "password":
      if (actionType === "update" && !value) return ""; // Allow empty password on update
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/(?=.*[a-z])/.test(value))
        return "Password must contain at least one lowercase letter";
      if (!/(?=.*[A-Z])/.test(value))
        return "Password must contain at least one uppercase letter";
      if (!/(?=.*\d)/.test(value))
        return "Password must contain at least one number";
      if (!/(?=.*[!@#$%^&*])/.test(value))
        return "Password must contain at least one special character (!@#$%^&*)";
      return "";

    case "dob":
      if (!value) return "Birthday is required";
      const birthDate = new Date(value);
      const today = new Date();

      if (isNaN(birthDate.getTime())) return "Please enter a valid date";
      if (birthDate > today) return "Birthday cannot be in the future";

      // Check if user is at least 13 years old
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      if (age < 13) return "User must be at least 13 years old";
      return "";

    default:
      return "";
  }
};

export default validateField;
