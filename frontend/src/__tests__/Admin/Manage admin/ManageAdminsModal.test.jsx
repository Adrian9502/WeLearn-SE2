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
import ManageAdminsModal from "../../../components/Admin/ManageAdmins/ManageAdminsModal";
import Swal from "sweetalert2";

jest.mock("axios");
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));
describe("ManageAdminsModal", () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    type: "create",
    onAdminCreated: jest.fn(),
    onAdminUpdated: jest.fn(),
    onAdminDeleted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("validates form before submission", async () => {
    render(
      <ManageAdminsModal isOpen={true} type="create" onClose={jest.fn()} />
    ); // Ensure modal is open

    // Check if the modal is displayed
    expect(screen.getByText(/create admin/i)).toBeInTheDocument(); // Change to the correct title text

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

  test("handles successful admin creation", async () => {
    axios.mockResolvedValueOnce({
      data: { message: "Admin created successfully" },
    });

    render(<ManageAdminsModal {...mockProps} />);

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
        url: "http://localhost:5000/api/admins",
        data: {
          fullName: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          password: "password123",
          dob: "1990-01-01",
          adminId: "",
        },
      });
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Success!",
        text: "Admin created successfully",
        icon: "success",
      });
      expect(mockProps.onAdminCreated).toHaveBeenCalled();
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  test("handles API error", async () => {
    const errorMessage = "Username or email already exists";
    axios.mockRejectedValueOnce({
      response: {
        data: {
          errors: [{ path: "password", msg: errorMessage }],
        },
      },
    });

    render(<ManageAdminsModal {...mockProps} />);

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
    render(<ManageAdminsModal {...mockProps} />);
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test("handles admin update correctly", async () => {
    const existingAdmin = {
      adminId: "123",
      fullName: "John Doe",
      username: "johndoe",
      email: "john@example.com",
      password: "password123",
      dob: "1990-01-01",
    };

    const updatedAdmin = {
      adminId: "123",
      fullName: "John Updated Doe",
      username: "johnupdated",
      email: "john.updated@example.com",
      password: "newpassword123",
      dob: "1991-02-02",
    };

    const mockProps = {
      isOpen: true,
      onClose: jest.fn(),
      type: "update",
      onAdminUpdated: jest.fn(),
    };

    axios.mockResolvedValueOnce({
      data: { message: "Admin updated successfully" },
    });

    render(<ManageAdminsModal {...mockProps} />);

    // Fill the form with existing admin data
    fireEvent.change(screen.getByLabelText("Admin ID:"), {
      target: { value: existingAdmin.adminId },
    });
    fireEvent.change(screen.getByLabelText("Full Name:"), {
      target: { value: updatedAdmin.fullName },
    });
    fireEvent.change(screen.getByLabelText("Username:"), {
      target: { value: updatedAdmin.username },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: updatedAdmin.email },
    });
    fireEvent.change(screen.getByLabelText("Password:"), {
      target: { value: updatedAdmin.password },
    });
    fireEvent.change(screen.getByLabelText("Birthday:"), {
      target: { value: updatedAdmin.dob },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      // Check if the correct API call was made
      expect(axios).toHaveBeenCalledWith({
        method: "PUT",
        url: `http://localhost:5000/api/admins/${existingAdmin.adminId}`,
        data: updatedAdmin,
      });

      // Check if success message was shown
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Success!",
        text: "Admin updated successfully",
        icon: "success",
      });

      // Check if onAdminUpdated callback was called
      expect(mockProps.onAdminUpdated).toHaveBeenCalled();

      // Check if modal was closed
      expect(mockProps.onClose).toHaveBeenCalled();
    });
  });

  test("renders correctly for create type", () => {
    render(<ManageAdminsModal {...mockProps} />);
    expect(screen.getByText("Create Admin")).toBeInTheDocument();
    expect(screen.getByLabelText("Full Name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Username:")).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Birthday:")).toBeInTheDocument();
  });

  test("renders correctly for update type", () => {
    render(<ManageAdminsModal {...mockProps} type="update" />);
    expect(screen.getByText("Update Admin")).toBeInTheDocument();
    expect(screen.getByLabelText("Admin ID:")).toBeInTheDocument();
  });

  test("renders correctly for delete type", () => {
    render(<ManageAdminsModal {...mockProps} type="delete" />);
    expect(screen.getByText("Delete Admin")).toBeInTheDocument();
    expect(screen.getByLabelText("Admin ID:")).toBeInTheDocument();
    expect(screen.queryByLabelText("Full Name:")).not.toBeInTheDocument();
  });

  test("handles input changes", () => {
    render(<ManageAdminsModal {...mockProps} />);
    const fullNameInput = screen.getByLabelText("Full Name:");
    fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
    expect(fullNameInput.value).toBe("John Doe");
  });
});
