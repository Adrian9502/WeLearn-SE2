const validateField = (name, value, actionType) => {
  switch (name) {
    case "quizId":
      if (actionType === "create") return "";
      if (!value) return "Quiz ID is required";
      if (!/^[A-Za-z0-9-_]+$/.test(value))
        return "Quiz ID can only contain letters, numbers, hyphens and underscores";
      if (value.length < 3) return "Quiz ID must be at least 3 characters";
      return "";
    case "title":
      if (!value) return "Title is required";
      if (value.length < 3) return "Title must be at least 3 characters";
      if (value.length > 100) return "Title must not exceed 100 characters";
      return "";
    case "instructions":
      if (!value) return "Instructions are required";
      if (value.length < 8) return "Instructions must be at least 8 characters";
      return "";
    case "questions":
      if (!value) return "Question is required";
      if (value.length < 5) return "Question must be at least 5 characters";
      return "";
    case "answer":
      if (!value) return "Answer is required";
      if (value.length < 1) return "Answer must be at least 1 character";
      return "";
    case "type": {
      if (!value) return "Type is required";
      const validTypes = [
        "Bubble Sort",
        "Insertion Sort",
        "Merge Sort",
        "Selection Sort",
        "Addition",
        "Subtraction",
        "Multiplication",
        "Alphabet",
      ];
      if (!validTypes.includes(value)) return "Invalid quiz type";
      return "";
    }
    case "difficulty":
      if (!value) return "Difficulty is required";
      if (!["Easy", "Medium", "Hard"].includes(value))
        return "Invalid difficulty level";
      return "";
    case "category":
      if (!value) return "Category is required";
      if (!["Sorting Algorithms", "Binary Operations"].includes(value))
        return "Invalid category";
      return "";
    default:
      return "";
  }
};

export default validateField;
