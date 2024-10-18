import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ManageUsers from "../../../../components/Admin/ManageUsers/ManageUsers";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import React from "react";
// Mock the axios module
jest.mock("axios");

describe("ManageUsers Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  test("renders loading state initially", () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<ManageUsers />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeVisible();
  });

  test("renders error message on failed fetch", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));
    render(<ManageUsers />);

    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );
    expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
  });

  test("displays user data after successful fetch", async () => {
    const mockUserData = [
      {
        _id: "1",
        fullName: "John Doe",
        coins: 100,
        username: "john_doe",
        email: "john@example.com",
        dob: "1990-01-01",
        isAdmin: false,
        createdAt: "2024-01-01T12:00:00Z",
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    render(<ManageUsers />);

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john_doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  test("opens modal when handleOpenModal is called", async () => {
    const { getByText } = render(<ManageUsers />);
    axios.get.mockResolvedValueOnce({ data: [] });

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    const openModalButton = screen.getByText(/create user/i); // Assume there's a button for creating a user
    fireEvent.click(openModalButton);

    expect(screen.getByText(/manage users modal/i)).toBeVisible(); // Modify based on actual modal title
  });

  test("filters users based on search term", async () => {
    const mockUserData = [
      {
        _id: "1",
        fullName: "John Doe",
        coins: 100,
        username: "john_doe",
        email: "john@example.com",
        dob: "1990-01-01",
        isAdmin: false,
        createdAt: "2024-01-01T12:00:00Z",
      },
      {
        _id: "2",
        fullName: "Jane Smith",
        coins: 200,
        username: "jane_smith",
        email: "jane@example.com",
        dob: "1992-02-02",
        isAdmin: true,
        createdAt: "2024-01-02T12:00:00Z",
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    render(<ManageUsers />);

    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );

    const searchInput = screen.getByPlaceholderText(/search/i); // Assuming there's a search input
    fireEvent.change(searchInput, { target: { value: "John" } });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });
});
