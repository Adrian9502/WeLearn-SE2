import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import Forms from "../../components/Login/Forms";

// Mock the modules
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const MockProvider = ({ children }) => {
  return <div>{children}</div>;
};

const renderWithProvider = (ui, options) =>
  render(ui, { wrapper: MockProvider, ...options });

describe("Forms Component", () => {
  const mockSetErrors = jest.fn();
  const mockSetFormError = jest.fn();
  const mockSetIsPopupOpen = jest.fn();

  const defaultProps = {
    isRegister: false,
    isAdmin: false,
    errors: {},
    formError: "",
    setErrors: mockSetErrors,
    setFormError: mockSetFormError,
    setIsPopupOpen: mockSetIsPopupOpen,
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
    axios.post = jest.fn(); // Mock axios post
  });

  test("renders login form correctly", () => {
    renderWithProvider(<Forms {...defaultProps} />);
    expect(screen.getByText("User Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("renders registration form correctly", () => {
    renderWithProvider(<Forms {...defaultProps} isRegister={true} />);
    expect(screen.getByText("User Registration")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("New Username")).toBeInTheDocument();
    expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();
  });

  test("displays form errors", () => {
    const errors = {
      username: "Username is required",
      password: "Password is required",
    };
    renderWithProvider(<Forms {...defaultProps} errors={errors} />);
    expect(screen.getByText("Username is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  test("handles user login submission correctly", async () => {
    axios.post.mockResolvedValue({
      data: { user: { id: 1, username: "user123" } },
    });

    renderWithProvider(<Forms {...defaultProps} />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "user123" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/login/user",
        { username: "user123", password: "123", isAdmin: false }
      );
    });
  });

  test("handles admin login submission correctly", async () => {
    axios.post.mockResolvedValue({
      data: { user: { id: 2, username: "admin123" } },
    });

    // Update props for admin login
    const adminProps = {
      ...defaultProps,
      isAdmin: true,
    };

    renderWithProvider(<Forms {...adminProps} />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "admin123" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/login/admin",
        { username: "admin123", password: "123", isAdmin: true }
      );
    });
  });

  test("handles user registration submission correctly", async () => {
    axios.post.mockResolvedValue({
      data: { message: "Registration successful" },
    });

    renderWithProvider(<Forms {...defaultProps} isRegister={true} />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText("New Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("New Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Date of Birth"), {
      target: { value: "2000-01-01" },
    });
    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/register/user",
        expect.objectContaining({
          fullName: "Test User",
          username: "testuser",
          email: "test@example.com",
          password: "password123",
          dob: "2000-01-01",
          isAdmin: false,
        })
      );
    });
  });
  test("handles admin registration submission correctly", async () => {
    const errors = {}; // Initialize an empty errors object
    const { getByTestId, getByText } = render(
      <Forms
        isRegister={true}
        isAdmin={true}
        errors={errors} // Pass errors as prop
        setErrors={jest.fn()}
        setFormError={jest.fn()}
        setIsPopupOpen={jest.fn()}
      />
    );

    fireEvent.change(getByTestId("fullName"), {
      target: { value: "Admin User" },
    });
    fireEvent.change(getByTestId("username"), {
      target: { value: "adminUser" },
    });
    fireEvent.change(getByTestId("password"), {
      target: { value: "password123" },
    });
    fireEvent.change(getByTestId("confirmPassword"), {
      target: { value: "password123" },
    });
    fireEvent.change(getByTestId("email"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(getByTestId("dob"), {
      target: { value: "1990-01-01" },
    });
    fireEvent.click(getByText("Register"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/register/admin",
        expect.objectContaining({
          fullName: "Admin User",
          username: "adminUser",
          password: "password123",
          email: "admin@example.com",
          dob: "1990-01-01",
          isAdmin: true,
        })
      );
    });
  });

  test("handles login error correctly", async () => {
    axios.post.mockRejectedValue(new Error("Invalid credentials"));
    renderWithProvider(<Forms {...defaultProps} />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockSetFormError).toHaveBeenCalledWith(
        "Invalid username or password. Please try again."
      );
    });
  });

  test("closes form when close button is clicked", () => {
    renderWithProvider(<Forms {...defaultProps} />);
    fireEvent.click(screen.getByText("Close"));
    expect(mockSetIsPopupOpen).toHaveBeenCalledWith(false);
  });
});
