import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import ManageQuizzesModal from "../../../components/Admin/ManageQuiz/ManageQuizzesModal";
import Swal from "sweetalert2";
jest.mock("axios");
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("ManageQuizzesModal", () => {
  const mockOnClose = jest.fn();
  const mockOnQuizCreated = jest.fn();
  const mockOnQuizUpdated = jest.fn();
  const mockOnQuizDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders create quiz form when type is "create"', () => {
    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="create"
        onQuizCreated={mockOnQuizCreated}
      />
    );

    // Check for heading
    expect(screen.getByText("Create Quiz")).toBeInTheDocument();

    // Check for text inputs and textareas
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Instructions")).toBeInTheDocument();
    expect(screen.getByLabelText("Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Answer")).toBeInTheDocument();

    // Check for select elements and their labels
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /type/i })).toBeInTheDocument();

    expect(screen.getByText("Difficulty")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /difficulty/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toBeInTheDocument();

    // Check for select options
    expect(screen.getByText("Select quiz type")).toBeInTheDocument();
    expect(screen.getByText("Select difficulty")).toBeInTheDocument();
    expect(screen.getByText("Select category")).toBeInTheDocument();
  });

  test('renders update quiz form when type is "update"', () => {
    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="update"
        onQuizUpdated={mockOnQuizUpdated}
      />
    );

    expect(screen.getByText("Update Quiz")).toBeInTheDocument();
    expect(screen.getByLabelText("Quiz ID")).toBeInTheDocument();

    // Also test for other fields in update form
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Instructions")).toBeInTheDocument();
    expect(screen.getByLabelText("Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Answer")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /type/i })).toBeInTheDocument();
    expect(screen.getByText("Difficulty")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /difficulty/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toBeInTheDocument();
  });

  test('renders delete quiz form when type is "delete"', () => {
    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="delete"
        onQuizDeleted={mockOnQuizDeleted}
      />
    );

    expect(screen.getByText("Delete Quiz")).toBeInTheDocument();
    expect(screen.getByLabelText("Quiz ID")).toBeInTheDocument();
  });

  test("submits create quiz form successfully", async () => {
    axios.mockResolvedValueOnce({
      data: { message: "Quiz created successfully" },
    });

    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="create"
        onQuizCreated={mockOnQuizCreated}
      />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Quiz" },
    });
    fireEvent.change(screen.getByLabelText("Instructions"), {
      target: { value: "Test instructions" },
    });
    fireEvent.change(screen.getByLabelText("Question"), {
      target: { value: "Test question?" },
    });
    fireEvent.change(screen.getByLabelText("Answer"), {
      target: { value: "Test answer" },
    });

    // For select elements, use getByRole
    const typeSelect = screen.getByRole("combobox", { name: /type/i });
    fireEvent.change(typeSelect, {
      target: { value: "Bubble Sort" },
    });

    const difficultySelect = screen.getByRole("combobox", {
      name: /difficulty/i,
    });
    fireEvent.change(difficultySelect, {
      target: { value: "Easy" },
    });

    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    fireEvent.change(categorySelect, {
      target: { value: "Sorting Algorithms" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: "POST",
        url: "/api/quizzes",
        data: expect.objectContaining({
          title: "Test Quiz",
          instructions: "Test instructions",
          questions: "Test question?",
          answer: "Test answer",
          type: "Bubble Sort",
          difficulty: "Easy",
          category: "Sorting Algorithms",
        }),
      });
      expect(mockOnQuizCreated).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("submits delete quiz form successfully", async () => {
    axios.mockResolvedValueOnce({
      data: { message: "Quiz deleted successfully" },
    });

    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="delete"
        onQuizDeleted={mockOnQuizDeleted}
      />
    );

    fireEvent.change(screen.getByLabelText("Quiz ID"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: "DELETE",
        url: "/api/quizzes/123",
        data: expect.objectContaining({
          quizId: "123",
          title: "",
          instructions: "",
          questions: "",
          answer: "",
          type: "",
          difficulty: "",
          category: "",
        }),
      });
      expect(mockOnQuizDeleted).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("handles form validation errors", async () => {
    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="create"
        onQuizCreated={mockOnQuizCreated}
      />
    );

    // Input data that doesn't meet the requirements
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Te" },
    });
    fireEvent.change(screen.getByLabelText("Instructions"), {
      target: { value: "Short" },
    });
    fireEvent.change(screen.getByLabelText("Question"), {
      target: { value: "Q?" },
    });
    fireEvent.change(screen.getByLabelText("Answer"), {
      target: { value: "A" },
    });

    // For select elements, use getByRole
    const typeSelect = screen.getByRole("combobox", { name: /type/i });
    fireEvent.change(typeSelect, {
      target: { value: "" }, // Empty type
    });

    const difficultySelect = screen.getByRole("combobox", {
      name: /difficulty/i,
    });
    fireEvent.change(difficultySelect, {
      target: { value: "Invalid" }, // Invalid difficulty
    });

    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    fireEvent.change(categorySelect, {
      target: { value: "Invalid" }, // Invalid category
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Validation Error",
          icon: "error",
          background: "#1e293b",
          color: "#fff",
          customClass: {
            popup: "border border-slate-700",
          },
        })
      );
    });

    expect(axios).not.toHaveBeenCalled();
    expect(mockOnQuizCreated).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("closes modal when Close button is clicked", () => {
    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="create"
        onQuizCreated={mockOnQuizCreated}
      />
    );

    fireEvent.click(screen.getByTestId("close-modal-button"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("validates type field correctly", async () => {
    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="create"
        onQuizCreated={mockOnQuizCreated}
      />
    );

    const typeInput = screen.getByRole("combobox", { name: /type/i });

    // Test valid types
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

    for (const validType of validTypes) {
      fireEvent.change(typeInput, { target: { value: validType } });
      expect(screen.queryByText("Type is required")).not.toBeInTheDocument();
    }

    // Test invalid type
    fireEvent.change(typeInput, { target: { value: "" } });
    fireEvent.blur(typeInput);
    expect(screen.getByText("Type is required")).toBeInTheDocument();
  });

  test("validates difficulty field correctly", async () => {
    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="create"
        onQuizCreated={mockOnQuizCreated}
      />
    );

    const difficultyInput = screen.getByRole("combobox", {
      name: /difficulty/i,
    });

    // Test valid difficulties
    const validDifficulties = ["Easy", "Medium", "Hard"];

    for (const difficulty of validDifficulties) {
      fireEvent.change(difficultyInput, { target: { value: difficulty } });
      expect(
        screen.queryByText("Difficulty is required")
      ).not.toBeInTheDocument();
    }

    // Test invalid difficulty
    fireEvent.change(difficultyInput, { target: { value: "" } });
    fireEvent.blur(difficultyInput);
    expect(screen.getByText("Difficulty is required")).toBeInTheDocument();
  });
});
