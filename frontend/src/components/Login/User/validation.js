const validateFormField = (fieldName, value) => {
  switch (fieldName) {
    case "fullName":
      if (!value.trim()) {
        return "Full Name is required";
      } else if (value.length < 6) {
        return "Full Name must be at least 6 characters";
      } else if (/[^a-zA-Z\s]/.test(value)) {
        return "Full Name can only contain letters and spaces";
      }
      break;
    case "username":
      if (!value.trim()) {
        return "Username is required";
      } else if (value.length < 6) {
        return "Username must be at least 6 characters";
      } else if (value.length > 20) {
        return "Username cannot be longer than 20 characters";
      } else if (!/^[a-zA-Z]/.test(value)) {
        return "Username must start with a letter";
      } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
        return "Username can only contain letters, numbers, and underscores";
      } else if (/__/.test(value)) {
        return "Username cannot contain consecutive underscores";
      } else if (/_$/.test(value)) {
        return "Username cannot end with an underscore";
      } else if (!/[a-zA-Z]/.test(value.slice(1))) {
        return "Username must contain at least one letter after the first character";
      }
      break;
    case "password":
      if (!value) {
        return "Password is required";
      } else if (value.length < 6) {
        return "Password must be at least 6 characters";
      }
      break;
    case "confirmPassword":
      if (!value) {
        return "Confirm password is required";
      }
      break;
    case "email":
      const trimmedEmail = value.trim();
      if (!trimmedEmail) {
        return "Email is required";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return "Email is invalid";
      }
      const domainPart = trimmedEmail.split("@")[1];
      const tld = domainPart.split(".").pop();
      if (/[0-9]$/.test(tld) || /[^a-zA-Z]$/.test(tld)) {
        return "Email cannot end with numbers or special characters";
      }
      break;
    case "dob":
      if (!value) {
        return "Date of Birth is required";
      }
      const today = new Date();
      const dobDate = new Date(value);
      const age = today.getFullYear() - dobDate.getFullYear();
      if (
        age < 10 ||
        (age === 10 &&
          today < new Date(dobDate.setFullYear(dobDate.getFullYear() + 10)))
      ) {
        return "User must be at least 10 years old";
      }
      break;
    default:
      return null;
  }

  return null;
};

export default validateFormField;
