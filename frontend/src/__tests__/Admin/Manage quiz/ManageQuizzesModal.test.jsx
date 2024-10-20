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

    expect(screen.getByText("Create Quiz")).toBeInTheDocument();
    expect(screen.getByLabelText("Title:")).toBeInTheDocument();
    expect(screen.getByLabelText("Instructions:")).toBeInTheDocument();
    expect(screen.getByLabelText("Question:")).toBeInTheDocument();
    expect(screen.getByLabelText("Answer:")).toBeInTheDocument();
    expect(screen.getByLabelText("Category:")).toBeInTheDocument();
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
    expect(screen.getByLabelText("Quiz ID:")).toBeInTheDocument();
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
    expect(screen.getByLabelText("Quiz ID:")).toBeInTheDocument();
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

    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "Test Quiz" },
    });
    fireEvent.change(screen.getByLabelText("Instructions:"), {
      target: { value: "Test instructions" },
    });
    fireEvent.change(screen.getByLabelText("Question:"), {
      target: { value: "Test question?" },
    });
    fireEvent.change(screen.getByLabelText("Answer:"), {
      target: { value: "Test answer" },
    });
    fireEvent.change(screen.getByLabelText("Category:"), {
      target: { value: "Sorting Algorithm" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: "POST",
        url: "http://localhost:5000/api/quizzes",
        data: expect.objectContaining({
          title: "Test Quiz",
          instruction: "Test instructions",
          question: "Test question?",
          answer: "Test answer",
          category: "Sorting Algorithm",
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

    fireEvent.change(screen.getByLabelText("Quiz ID:"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: "DELETE",
        url: "http://localhost:5000/api/quizzes/123",
        data: expect.objectContaining({
          quizId: "123",
        }),
      });
      expect(mockOnQuizDeleted).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("handles form validation errors with short inputs", async () => {
    render(
      <ManageQuizzesModal
        isOpen={true}
        onClose={mockOnClose}
        type="create"
        onQuizCreated={mockOnQuizCreated}
      />
    );

    // Input data that doesn't meet the length requirements
    fireEvent.change(screen.getByLabelText("Title:"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText("Instructions:"), {
      target: { value: "Short" },
    });
    fireEvent.change(screen.getByLabelText("Question:"), {
      target: { value: "Short Q?" },
    });
    fireEvent.change(screen.getByLabelText("Answer:"), {
      target: { value: "Ans" },
    });
    fireEvent.change(screen.getByLabelText("Category:"), {
      target: { value: "Sorting Algorithm" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Error",
        text: "All fields are required. Title and answer must be at least 5 characters long. Instruction and question must be at least 10 characters long.",
        icon: "error",
      });
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

    fireEvent.click(screen.getByText("Close"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
