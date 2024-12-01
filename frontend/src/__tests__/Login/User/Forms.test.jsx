import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { UserProvider } from "../../../components/User/UserContext";
import Forms from "../../../components/Login/User/Forms";

// Mock dependencies
jest.mock("axios");
jest.mock("../../../components/User/UserContext", () => ({
  UserProvider: ({ children }) => children,
  useUser: () => ({
    saveUser: jest.fn(),
  }),
}));

// Mock react-router-dom navigation
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("Forms Component", () => {
  const defaultProps = {
    isRegister: false,
    errors: {},
    formError: "",
    setErrors: jest.fn(),
    setFormError: jest.fn(),
    setIsPopupOpen: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    const combinedProps = { ...defaultProps, ...props };
    return render(
      <MemoryRouter>
        <UserProvider>
          <Forms {...combinedProps} />
        </UserProvider>
      </MemoryRouter>
    );
  };

  // Registration Form Tests
  describe("Registration Form", () => {
    const registerProps = {
      ...defaultProps,
      isRegister: true,
    };

    it("renders registration form correctly", () => {
      renderComponent(registerProps);

      expect(screen.getByText("Create Account")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Confirm Password")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Date of Birth")).toBeInTheDocument();
    });

    it("submits registration form successfully", async () => {
      axios.post.mockResolvedValue({});

      renderComponent(registerProps);

      fireEvent.change(screen.getByPlaceholderText("Full Name"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "johndoe" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Date of Birth"), {
        target: { value: "1990-01-01" },
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Registration successful! Please login.")
        ).toBeInTheDocument();
      });
    });

    it("handles registration error", async () => {
      const errorResponse = {
        response: {
          data: {
            message: "Username already exists",
          },
        },
      };
      axios.post.mockRejectedValue(errorResponse);

      renderComponent(registerProps);

      fireEvent.change(screen.getByPlaceholderText("Full Name"), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText("Username"), {
        target: { value: "johndoe" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
        target: { value: "password123" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Date of Birth"), {
        target: { value: "1990-01-01" },
      });

      const submitButton = screen.getByRole("button", { name: /register/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Registration failed:/)).toBeInTheDocument();
      });
    });

    it("toggles password visibility", () => {
      renderComponent(registerProps);

      const passwordInput = screen.getByPlaceholderText("Password");
      const toggleButton = screen.getAllByRole("button")[1]; // Second button (first is close)

      expect(passwordInput).toHaveAttribute("type", "password");
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");
    });
  });

  // Close Button Test
  it("calls setIsPopupOpen when close button is clicked", () => {
    const setIsPopupOpen = jest.fn();
    renderComponent({ setIsPopupOpen });

    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(setIsPopupOpen).toHaveBeenCalledWith(false);
  });
});
