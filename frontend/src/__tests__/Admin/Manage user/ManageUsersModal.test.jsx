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
    ); // Ensure modal is open

    // Check if the modal is displayed
    expect(screen.getByText(/create user/i)).toBeInTheDocument(); // Change to the correct title text

    // Fill in the form fields with values less than 5 characters
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
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    // Assert that SweetAlert was called
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          text: "All fields are required and must be at least 5 characters long.",
          icon: "error",
        })
      );
    });
  });

  test("handles successful user creation", async () => {
    axios.mockResolvedValueOnce({
      data: { message: "User created successfully" },
    });

    render(<ManageUsersModal {...mockProps} />);

    const fullNameInput = screen.getByLabelText("Full Name:");
    const usernameInput = screen.getByLabelText("Username:");
    const emailInput = screen.getByLabelText("Email:");
    const passwordInput = screen.getByLabelText("Password:");
    const dobInput = screen.getByLabelText("Birthday:");

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(dobInput, { target: { value: "1990-01-01" } });

    const submitButton = screen.getByText("Create");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: "POST",
        url: "http://localhost:5000/api/users",
        data: {
          fullName: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          password: "password123",
          dob: "1990-01-01",
          userId: "",
        },
      });
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Success!",
        text: "User created successfully",
        icon: "success",
      });
      expect(mockProps.onUserCreated).toHaveBeenCalled();
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  test("handles API error", async () => {
    const errorMessage = "An error occurred";
    axios.mockRejectedValueOnce({
      response: {
        data: {
          errors: [{ path: "password", msg: errorMessage }],
        },
      },
    });

    render(<ManageUsersModal {...mockProps} />);

    // Fill out the form
    const fullNameInput = screen.getByLabelText("Full Name:");
    const usernameInput = screen.getByLabelText("Username:");
    const emailInput = screen.getByLabelText("Email:");
    const passwordInput = screen.getByLabelText("Password:");
    const dobInput = screen.getByLabelText("Birthday:");

    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(dobInput, { target: { value: "1990-01-01" } });

    const submitButton = screen.getByText("Create");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    });
  });

  test("closes modal when close button is clicked", () => {
    render(<ManageUsersModal {...mockProps} />);
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test("handles user update correctly", async () => {
    const existingUser = {
      userId: "123",
      fullName: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
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
    fireEvent.change(screen.getByLabelText("User ID:"), {
      target: { value: existingUser.userId },
    });
    fireEvent.change(screen.getByLabelText("Full Name:"), {
      target: { value: existingUser.fullName },
    });
    fireEvent.change(screen.getByLabelText("Username:"), {
      target: { value: existingUser.username },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: existingUser.email },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: existingUser.password },
    });
    fireEvent.change(screen.getByLabelText("Birthday:"), {
      target: { value: existingUser.dob },
    });

    // Update some fields
    fireEvent.change(screen.getByLabelText("Full Name:"), {
      target: { value: updatedUser.fullName },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: updatedUser.email },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      // Check if the correct API call was made
      expect(axios).toHaveBeenCalledWith({
        method: "PUT",
        url: `http://localhost:5000/api/users/${existingUser.userId}`,
        data: updatedUser,
      });

      // Check if success message was shown
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Success!",
        text: "User updated successfully",
        icon: "success",
      });

      // Check if onUserUpdated callback was called
      expect(mockProps.onUserUpdated).toHaveBeenCalled();

      // Check if modal was closed
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });
  test("renders correctly for create type", () => {
    render(<ManageUsersModal {...mockProps} />);
    expect(screen.getByText("Create User")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Username:")).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Birthday:")).toBeInTheDocument();
  });

  test("renders correctly for update type", () => {
    render(<ManageUsersModal {...mockProps} type="update" />);
    expect(screen.getByText("Update User")).toBeInTheDocument();
    expect(screen.getByLabelText("User ID:")).toBeInTheDocument();
  });

  test("renders correctly for delete type", () => {
    render(<ManageUsersModal {...mockProps} type="delete" />);
    expect(screen.getByText("Delete User")).toBeInTheDocument();
    expect(screen.getByLabelText("User ID:")).toBeInTheDocument();
    expect(screen.queryByLabelText("Full Name:")).not.toBeInTheDocument();
  });

  test("handles input changes", () => {
    render(<ManageUsersModal {...mockProps} />);
    const fullNameInput = screen.getByLabelText("Full Name:");
    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    expect(fullNameInput.value).toBe("John Doe");
  });
});
