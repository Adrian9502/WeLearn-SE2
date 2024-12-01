import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import ManageQuizzes from "../../../components/Admin/ManageQuiz/ManageQuizzes";

jest.mock("axios");
jest.mock(
  "../../../components/Admin/ManageQuiz/ManageQuizzesModal",
  () =>
    ({ isOpen, onClose }) =>
      isOpen ? <div data-testid="mock-modal">Modal Content</div> : null
);
jest.mock(
  "../../../components/Admin/DashboardManager",
  () =>
    ({ tableRows, onSearchChange, onSort }) =>
      (
        <div data-testid="mock-dashboard">
          <input
            data-testid="search-input"
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                <th onClick={() => onSort("Title")}>Title</th>
                <th onClick={() => onSort("Instructions")}>Instructions</th>
                <th onClick={() => onSort("Questions")}>Questions</th>
                <th onClick={() => onSort("Answer")}>Answer</th>
                <th onClick={() => onSort("Type")}>Type</th>
                <th onClick={() => onSort("Difficulty")}>Difficulty</th>
                <th onClick={() => onSort("Category")}>Category</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.ID}>
                  <td>{row.Title}</td>
                  <td>{row.Instructions}</td>
                  <td>{row.Questions}</td>
                  <td>{row.Answer}</td>
                  <td>{row.Type}</td>
                  <td>{row.Difficulty}</td>
                  <td>{row.Category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
);

const mockQuizData = [
  {
    _id: "1",
    title: "Quiz 1",
    instructions: "Instructions 1",
    questions: "Question 1",
    answer: "Answer 1",
    type: "Multiple Choice",
    difficulty: "Easy",
    category: "Sorting",
  },
  {
    _id: "2",
    title: "Quiz 2",
    instructions: "Instructions 2",
    questions: "Question 2",
    answer: "Answer 2",
    type: "True/False",
    difficulty: "Hard",
    category: "Binary",
  },
];

describe("ManageQuizzes Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockQuizData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("handles search functionality across all fields", async () => {
    render(<ManageQuizzes />);
    await waitFor(() => {
      expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-input");

    // Test searching by title
    fireEvent.change(searchInput, { target: { value: "Quiz 1" } });
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2); // Header + 1 data row
      expect(rows[1]).toHaveTextContent("Quiz 1");
    });

    // Test searching by difficulty
    fireEvent.change(searchInput, { target: { value: "Easy" } });
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2);
      expect(rows[1]).toHaveTextContent("Easy");
    });
  });

  test("handles sorting for all columns", async () => {
    render(<ManageQuizzes />);
    await waitFor(() => {
      expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();
    });

    // Test sorting by title
    const titleHeader = screen.getByText("Title");

    // Get initial order
    let titleCells = screen.getAllByRole("cell", { name: /Quiz \d/ });
    const initialFirstTitle = titleCells[0].textContent;

    // Click to change sort order
    fireEvent.click(titleHeader);
    await waitFor(() => {
      titleCells = screen.getAllByRole("cell", { name: /Quiz \d/ });
      expect(titleCells[0].textContent).not.toBe(initialFirstTitle);
    });

    // Click again to reverse sort order
    fireEvent.click(titleHeader);
    await waitFor(() => {
      titleCells = screen.getAllByRole("cell", { name: /Quiz \d/ });
      expect(titleCells[0].textContent).toBe(initialFirstTitle);
    });

    // Test sorting by difficulty
    const difficultyHeader = screen.getByText("Difficulty");
    fireEvent.click(difficultyHeader);
    await waitFor(() => {
      const difficultyCells = screen.getAllByRole("cell", {
        name: /(Easy|Hard)/,
      });
      // Sort alphabetically - "Easy" should come before "Hard"
      expect(difficultyCells[0]).toHaveTextContent("Easy");
      expect(difficultyCells[1]).toHaveTextContent("Hard");
    });
  });

  test("handles search functionality across all fields", async () => {
    render(<ManageQuizzes />);
    await waitFor(() => {
      expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-input");

    // Test searching by title
    fireEvent.change(searchInput, { target: { value: "Quiz 1" } });
    await waitFor(() => {
      const titleCells = screen.getAllByRole("cell", { name: /Quiz \d/ });
      expect(titleCells).toHaveLength(1);
      expect(titleCells[0]).toHaveTextContent("Quiz 1");
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: "" } });

    // Test searching by difficulty
    fireEvent.change(searchInput, { target: { value: "Easy" } });
    await waitFor(() => {
      const difficultyCells = screen.getAllByRole("cell", {
        name: /(Easy|Hard)/,
      });
      expect(difficultyCells).toHaveLength(1);
      expect(difficultyCells[0]).toHaveTextContent("Easy");
    });
  });

  test("renders loading state initially", () => {
    render(<ManageQuizzes />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("renders dashboard with all fields after data is loaded", async () => {
    render(<ManageQuizzes />);
    await waitFor(() => {
      expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();

      // Check if all column headers are present
      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Instructions")).toBeInTheDocument();
      expect(screen.getByText("Questions")).toBeInTheDocument();
      expect(screen.getByText("Answer")).toBeInTheDocument();
      expect(screen.getByText("Type")).toBeInTheDocument();
      expect(screen.getByText("Difficulty")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
    });
  });

  test("handles API error state", async () => {
    const errorMessage = "Failed to fetch quizzes";
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    render(<ManageQuizzes />);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(errorMessage, "i"))
      ).toBeInTheDocument();
    });
  });
});
