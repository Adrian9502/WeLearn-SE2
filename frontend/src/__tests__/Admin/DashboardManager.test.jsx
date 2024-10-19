import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardManager from "../../components/Admin/DashboardManager";

// Mock data for testing
const columns = ["ID", "Name", "Age"];
const rows = [
  { ID: "1", Name: "John", Age: 30 },
  { ID: "2", Name: "Doe", Age: 25 },
];

// Mock functions
const mockHandleOpenModal = jest.fn();
const mockOnSort = jest.fn();
const mockOnSearchChange = jest.fn();

describe("DashboardManager component", () => {
  beforeEach(() => {
    render(
      <DashboardManager
        title="Test Dashboard"
        handleOpenModal={mockHandleOpenModal}
        tableColumns={columns}
        tableRows={rows}
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        sortConfig={{ key: "Name", direction: "asc" }}
        onSort={mockOnSort}
      />
    );
  });

  test("renders the DashboardManager title", () => {
    expect(screen.getByText("Test Dashboard")).toBeInTheDocument();
  });

  test("renders the sort button and triggers sorting action", () => {
    const sortButton = screen.getByText(/Sort by name \(ASC\)/);
    expect(sortButton).toBeInTheDocument();

    // Simulate clicking the sort button
    fireEvent.click(sortButton);

    // Check if the onSort function has been called when the button is clicked
    expect(mockOnSort).toHaveBeenCalled();
  });

  test("triggers search input change", () => {
    const searchInput = screen.getByPlaceholderText("Search here..");
    fireEvent.change(searchInput, { target: { value: "John" } });
    expect(mockOnSearchChange).toHaveBeenCalledWith("John");
  });
  test("displays no data message when tableRows is empty", () => {
    render(
      <DashboardManager
        title="Test Dashboard"
        handleOpenModal={mockHandleOpenModal}
        tableColumns={columns}
        tableRows={[]}
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        sortConfig={{ key: "Name", direction: "asc" }}
        onSort={mockOnSort}
      />
    );
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  test("renders the buttons and triggers actions", () => {
    const createButton = screen.getByText("Create");
    fireEvent.click(createButton);
    expect(mockHandleOpenModal).toHaveBeenCalledWith("create");

    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);
    expect(mockHandleOpenModal).toHaveBeenCalledWith("update");

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);
    expect(mockHandleOpenModal).toHaveBeenCalledWith("delete");
  });

  test("table renders with correct data", () => {
    // Check if table data is rendered correctly
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });
  test("sort button changes appearance when active", () => {
    // Query the button by its role and name
    const sortButton = screen.getByRole("button", {
      name: /Sort by name \(ASC\)/,
    });
    expect(sortButton).toHaveClass("bg-violet-800");
  });

  test("copies ID and shows tooltip", async () => {
    // Get all buttons with the data-testid "copy-button"
    const copyButtons = screen.getAllByTestId("copy-button");

    // Click each button and check for the tooltip
    for (const button of copyButtons) {
      button.click();

      // Wait for the tooltip to appear
      await waitFor(() => {
        const tooltip = screen.getByText(/Copied!/i);
        expect(tooltip).toBeInTheDocument();
      });

      // Optionally, you can also check if the tooltip disappears after some time
      await waitFor(
        () => {
          expect(screen.queryByText(/Copied!/i)).not.toBeInTheDocument();
        },
        { timeout: 2500 }
      ); // Adjust timeout to be slightly longer than the tooltip display duration
    }
  });

  test("shows correct sorting indicator", () => {
    // Find the 'Name' column header
    const nameColumn = screen.getByText("Name");

    // Assert that the column header contains the sorting indicator '▲'
    expect(nameColumn).toHaveTextContent("▲"); // Ascending order
  });
});
