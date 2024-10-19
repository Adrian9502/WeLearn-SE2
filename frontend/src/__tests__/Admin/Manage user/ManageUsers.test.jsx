import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import axios from "axios";
import ManageUsers from "../../../components/Admin/ManageUsers/ManageUsers";

// Mock axios
jest.mock("axios");

// Mock child components
jest.mock(
  "../../../components/Admin/ManageUsers/ManageUsersModal",
  () => () => <div data-testid="manage-users-modal" />
);
jest.mock(
  "../../../components/Admin/DashboardManager",
  () =>
    ({ tableRows, onSearchChange, onSort, handleOpenModal }) =>
      (
        <div data-testid="dashboard-manager">
          <input
            data-testid="search-input"
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button data-testid="sort-button" onClick={() => onSort("Name")}>
            Sort
          </button>
          <button
            data-testid="create-button"
            onClick={() => handleOpenModal("create")}
          >
            Create
          </button>
          <div data-testid="table-rows">{tableRows.length}</div>
        </div>
      )
);

describe("ManageUsers Component", () => {
  const mockUserData = [
    {
      _id: "1",
      fullName: "John Doe",
      coins: 100,
      username: "johnd",
      email: "john@example.com",
      dob: "1990-01-01",
      isAdmin: false,
      createdAt: "2023-01-01T00:00:00.000Z",
    },
    {
      _id: "2",
      fullName: "Jane Smith",
      coins: 200,
      username: "janes",
      email: "jane@example.com",
      dob: "1995-05-05",
      isAdmin: true,
      createdAt: "2023-02-01T00:00:00.000Z",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockUserData });
  });

  test("renders user data after loading", async () => {
    render(<ManageUsers />);
    await waitFor(() =>
      expect(screen.getByTestId("dashboard-manager")).toBeInTheDocument()
    );
    expect(screen.getByTestId("table-rows").textContent).toBe("2");
  });

  test("handles search functionality", async () => {
    render(<ManageUsers />);
    await waitFor(() =>
      expect(screen.getByTestId("dashboard-manager")).toBeInTheDocument()
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "John" } });

    await waitFor(() =>
      expect(screen.getByTestId("table-rows").textContent).toBe("1")
    );
  });

  test("handles sort functionality", async () => {
    render(<ManageUsers />);
    await waitFor(() =>
      expect(screen.getByTestId("dashboard-manager")).toBeInTheDocument()
    );

    const sortButton = screen.getByTestId("sort-button");
    fireEvent.click(sortButton);

    // Add expectations based on how your sorting affects the display
  });
  test("handles error state", async () => {
    axios.get.mockRejectedValueOnce(new Error("API Error"));
    render(<ManageUsers />);

    await waitFor(() =>
      expect(screen.getByText("Something went wrong.")).toBeInTheDocument()
    );
    expect(screen.getByText("Failed to fetch: API Error")).toBeInTheDocument();
  });

  test("renders loading state initially", async () => {
    let resolvePromise;
    axios.get.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    render(<ManageUsers />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    await act(async () => {
      resolvePromise({ data: [] });
    });
  });
  test("opens modal on button click", async () => {
    axios.get.mockResolvedValue({ data: [] });

    await act(async () => {
      render(<ManageUsers />);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    // Change this line to match the actual text on your create button
    fireEvent.click(screen.getByTestId("create-button"));

    expect(screen.getByTestId("manage-users-modal")).toBeInTheDocument();
  });
});
