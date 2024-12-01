import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { UserProvider } from "../../../components/User/UserContext";
import AdminLogin from "../../../components/Login/Admin/AdminLogin";

// Mock dependencies
jest.mock("axios");
jest.mock("sweetalert2", () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  showLoading: jest.fn(),
}));

jest.mock("../../../components/User/UserContext", () => ({
  UserProvider: ({ children }) => children,
  useUser: () => ({
    saveUser: jest.fn(),
  }),
}));

const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("AdminLogin Component", () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/admin-login"]}>
        <UserProvider>
          <Routes>
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin-dashboard"
              element={<div>Admin Dashboard</div>}
            />
          </Routes>
        </UserProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form initially", () => {
    renderComponent();

    expect(screen.getByText(/Admin Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });
  test("validates login form fields", async () => {
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    // Check for validation errors
    expect(
      await screen.findByText(/Username is required/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  test("handles login error", async () => {
    // Mock login error response
    axios.post.mockRejectedValue({
      response: {
        status: 404,
        data: { message: "Username not found" },
      },
    });

    renderComponent();

    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "invaliduser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "wrongpassword" },
    });

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Username not found/i)).toBeInTheDocument();
    });
  });

  test("back to home button triggers confirmation", () => {
    renderComponent();

    const backButton = screen.getByText(/Back to home/i);
    fireEvent.click(backButton);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Are you sure?",
      })
    );
  });

  test("switches between login and registration modes", async () => {
    renderComponent();

    const modeSwitch = screen.getByText(/Need an admin account\? Register/i);

    // Use fireEvent to click
    fireEvent.click(modeSwitch);

    // Wait for the animation and state change
    await waitFor(
      () => {
        // Use screen.queryByText to avoid throwing an error if not found immediately
        const registrationTitle = screen.queryByText(/Create Admin Account/i);
        expect(registrationTitle).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    // Check for registration-specific fields
    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Date of Birth/i)).toBeInTheDocument();
  });
  test("submits login successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        token: "fake-token",
        admin: {
          username: "testadmin",
          _id: "123",
        },
      },
    });

    renderComponent();

    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    // Wait for successful login and verify localStorage calls
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "authToken",
        "fake-token"
      );
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "userRole",
        "admin"
      );
    });
  });

  test("handles validation errors", async () => {
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  test("handles network errors", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 404,
        data: { message: "Username not found" },
      },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: "nonexistent" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Username not found/i)).toBeInTheDocument();
    });
  });
});
