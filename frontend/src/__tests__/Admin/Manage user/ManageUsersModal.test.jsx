import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import ManageUsersModal from "../../../components/Admin/ManageUsers/ManageUsersModal";
import Swal from "sweetalert2";

jest.mock("axios");
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));
describe("ManageUsersModal", () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    type: "create",
    onUserCreated: jest.fn(),
    onUserUpdated: jest.fn(),
    onUserDeleted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("validates form before submission", async () => {
    render(
      <ManageUsersModal isOpen={true} type="create" onClose={jest.fn()} />
    );

    // Check if the modal is displayed
    expect(screen.getByTestId("modal-title")).toHaveTextContent(/create user/i);

    // Fill in the form fields with invalid values
    fireEvent.change(screen.getByTestId("fullName"), {
      target: { value: "as" },
    });
    fireEvent.change(screen.getByTestId("username"), {
      target: { value: "as" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "as@asdgmail.com" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "assas" },
    });
    fireEvent.change(screen.getByTestId("dob"), {
      target: { value: "2000-01-01" },
    });

    // Submit the form
    fireEvent.click(screen.getByTestId("submit-button"));

    // Assert that SweetAlert was called with the validation error message
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Validation Error",
        text: "Please check all fields and try again",
        icon: "error",
        background: "#1e293b",
        color: "#fff",
        customClass: {
          popup: "border border-slate-700",
        },
      });
    });
  });

  test("handles successful user creation", async () => {
    axios.mockResolvedValueOnce({
      data: { message: "User created successfully" },
    });

    render(<ManageUsersModal {...mockProps} />);

    // Using data-testid to find elements
    const fullNameInput = screen.getByTestId("fullName");
    const usernameInput = screen.getByTestId("username");
    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");
    const dobInput = screen.getByTestId("dob");
    const submitButton = screen.getByTestId("submit-button");

    // Fill in form with valid data that meets all validation requirements
    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(usernameInput, { target: { value: "johndoe123" } }); // Added numbers for validation
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "Password123!" }, // Meets password requirements
    });
    fireEvent.change(dobInput, { target: { value: "1990-01-01" } });

    // Trigger blur events to ensure validation runs
    fireEvent.blur(fullNameInput);
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(dobInput);

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: "POST",
        url: "/api/users",
        data: {
          fullName: "John Doe",
          username: "johndoe123",
          email: "john@example.com",
          password: "Password123!",
          dob: "1990-01-01",
          userId: "",
        },
      });

      // Check for success message
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Success!",
        text: "User created successfully",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        customClass: {
          popup: "border border-slate-700",
        },
      });

      // Check if callbacks were called
      expect(mockProps.onUserCreated).toHaveBeenCalled();
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  test("handles API error", async () => {
    const errorMessage = "An error occurred";
    axios.mockRejectedValueOnce({
      response: {
        status: 400,
        message: errorMessage,
      },
    });

    render(<ManageUsersModal {...mockProps} />);

    // Fill out the form with valid data
    const fullNameInput = screen.getByTestId("fullName");
    const usernameInput = screen.getByTestId("username");
    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");
    const dobInput = screen.getByTestId("dob");

    // Fill in form with valid data that meets all validation requirements
    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(usernameInput, { target: { value: "johndoe123" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "Password123!" },
    });
    fireEvent.change(dobInput, { target: { value: "1990-01-01" } });

    // Trigger blur events to ensure validation runs
    fireEvent.blur(fullNameInput);
    fireEvent.blur(usernameInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.blur(dobInput);

    // Submit form
    const submitButton = screen.getByTestId("submit-button");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check error message matches component implementation
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Error",
        text: `Error 400: An error occurred`,
        icon: "error",
        background: "#1e293b",
        color: "#fff",
        customClass: {
          popup: "border border-slate-700",
        },
      });
    });
  });

  test("closes modal when close button is clicked", () => {
    render(<ManageUsersModal {...mockProps} />);
    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test("handles user update correctly", async () => {
    const existingUser = {
      userId: "123",
      fullName: "John Doe",
      username: "johndoe123", // Updated to meet validation
      email: "john@example.com",
      password: "Password123!", // Updated to meet validation
      dob: "1990-01-01",
    };

    const updatedUser = {
      ...existingUser,
      fullName: "John Updated Doe",
      email: "john.updated@example.com",
    };

    const mockProps = {
      isOpen: true,
      onClose: jest.fn(),
      type: "update",
      onUserUpdated: jest.fn(),
    };

    axios.mockResolvedValueOnce({
      data: { message: "User updated successfully" },
    });

    render(<ManageUsersModal {...mockProps} />);

    // Fill the form with existing user data
    const inputs = {
      userId: screen.getByTestId("userId"),
      fullName: screen.getByTestId("fullName"),
      username: screen.getByTestId("username"),
      email: screen.getByTestId("email"),
      password: screen.getByTestId("password"),
      dob: screen.getByTestId("dob"),
    };

    // Fill initial data
    Object.entries(existingUser).forEach(([field, value]) => {
      fireEvent.change(inputs[field], { target: { value } });
      fireEvent.blur(inputs[field]); // Trigger validation
    });

    // Update specific fields
    fireEvent.change(inputs.fullName, {
      target: { value: updatedUser.fullName },
    });
    fireEvent.blur(inputs.fullName);

    fireEvent.change(inputs.email, { target: { value: updatedUser.email } });
    fireEvent.blur(inputs.email);

    // Submit the form
    await act(async () => {
      fireEvent.click(screen.getByTestId("submit-button"));
    });

    await waitFor(() => {
      // Check API call
      expect(axios).toHaveBeenCalledWith({
        method: "PUT",
        url: `/api/users/${existingUser.userId}`,
        data: updatedUser,
      });

      // Check success message
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Success!",
        text: "User updated successfully",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        customClass: {
          popup: "border border-slate-700",
        },
      });

      // Check callbacks
      expect(mockProps.onUserUpdated).toHaveBeenCalled();
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  test("renders correctly for create type", () => {
    render(<ManageUsersModal {...mockProps} />);
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Create User");
    expect(screen.getByTestId("fullName")).toBeInTheDocument();
    expect(screen.getByTestId("username")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("dob")).toBeInTheDocument();
  });

  test("renders correctly for update type", () => {
    render(<ManageUsersModal {...mockProps} type="update" />);
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Update User");
    expect(screen.getByTestId("userId")).toBeInTheDocument();
  });

  test("renders correctly for delete type", () => {
    render(<ManageUsersModal {...mockProps} type="delete" />);
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Delete User");
    expect(screen.getByTestId("userId")).toBeInTheDocument();
    expect(screen.queryByTestId("fullName")).not.toBeInTheDocument();
  });

  test("handles input changes", () => {
    render(<ManageUsersModal {...mockProps} />);
    const fullNameInput = screen.getByTestId("fullName");
    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    expect(fullNameInput.value).toBe("John Doe");
  });
});
