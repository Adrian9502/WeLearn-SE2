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
        sortTitle="name"
      />
    );
  });

  test("renders the DashboardManager title", () => {
    expect(screen.getByText("Test Dashboard")).toBeInTheDocument();
  });

  test("renders the sort button and triggers sorting action", () => {
    const sortButton = screen.getByText(/Sort by name/i);
    expect(sortButton).toBeInTheDocument();

    // Check if the up chevron is present for ascending sort
    expect(screen.getByTestId("chevron-up")).toBeInTheDocument();

    // Simulate clicking the sort button
    fireEvent.click(sortButton);
    expect(mockOnSort).toHaveBeenCalledWith("Name");
  });

  test("triggers search input change", () => {
    const searchInput = screen.getByPlaceholderText("Search...");
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
        sortTitle="name"
      />
    );
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  test("renders the action buttons and triggers actions", () => {
    const createButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(createButton);
    expect(mockHandleOpenModal).toHaveBeenCalledWith("create");

    const updateButton = screen.getByRole("button", { name: /update/i });
    fireEvent.click(updateButton);
    expect(mockHandleOpenModal).toHaveBeenCalledWith("update");

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockHandleOpenModal).toHaveBeenCalledWith("delete");
  });

  test("table renders with correct data", () => {
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  test("sort direction changes appearance", () => {
    // Re-render with descending sort
    render(
      <DashboardManager
        title="Test Dashboard"
        handleOpenModal={mockHandleOpenModal}
        tableColumns={columns}
        tableRows={rows}
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        sortConfig={{ key: "Name", direction: "desc" }}
        onSort={mockOnSort}
        sortTitle="name"
      />
    );

    // Check if the down chevron is present for descending sort
    expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
  });
});
