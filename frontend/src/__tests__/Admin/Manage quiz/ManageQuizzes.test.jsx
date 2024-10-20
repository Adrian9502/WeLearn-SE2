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
  "../../../components/Admin/ManageQuiz/QuizDashboardManager",
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
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.ID}>
                  <td>{row.Title}</td>
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
    instruction: "Inst 1",
    question: "Q1",
    answer: "A1",
    category: "sorting",
  },
  {
    _id: "2",
    title: "Quiz 2",
    instruction: "Inst 2",
    question: "Q2",
    answer: "A2",
    category: "binary",
  },
];

describe("ManageQuizzes Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockQuizData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    render(<ManageQuizzes />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("renders dashboard after data is loaded", async () => {
    render(<ManageQuizzes />);
    await waitFor(() => {
      expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();
    });
  });

  test("handles search functionality", async () => {
    render(<ManageQuizzes />);
    await waitFor(() => {
      expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Quiz 1" } });

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(2); // Header row + 1 data row
      expect(rows[1]).toHaveTextContent("Quiz 1");
    });
  });

  test("handles sorting functionality", async () => {
    render(<ManageQuizzes />);
    await waitFor(() => {
      expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();
    });

    const titleHeader = screen.getByText("Title");
    fireEvent.click(titleHeader);

    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveTextContent("Quiz 2");
      expect(rows[2]).toHaveTextContent("Quiz 1");
    });
  });
});
