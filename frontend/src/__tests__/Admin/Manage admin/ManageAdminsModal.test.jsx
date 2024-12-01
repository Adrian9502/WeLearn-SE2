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
  fire: jest.fn().mockResolvedValue({}),
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
    render(<ManageAdminsModal {...mockProps} />);

    // Fill in the form fields with invalid values
    fireEvent.change(screen.getByLabelText(/full name:/i), {
      target: { value: "as" },
    });
    fireEvent.change(screen.getByLabelText(/username:/i), {
      target: { value: "as" },
    });
    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "123" },
    });

    // Get the form element
    const form = screen.getByRole("form");

    // Submit the form using a submit event
    await act(async () => {
      fireEvent.submit(form);
    });

    // Wait for validation
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: expect.any(String),
        })
      );
    });
  });

  test("validates specific field requirements", async () => {
    render(<ManageAdminsModal {...mockProps} />);

    // Test password requirements
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "weakpass" },
    });
    fireEvent.blur(screen.getByLabelText(/password:/i));

    // Submit the form to trigger validation
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: expect.any(String),
        })
      );
    });

    // Test email format
    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "invalid@email" },
    });
    fireEvent.blur(screen.getByLabelText(/email:/i));
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: expect.any(String),
        })
      );
    });

    // Test username format
    fireEvent.change(screen.getByLabelText(/username:/i), {
      target: { value: "user@name" },
    });
    fireEvent.blur(screen.getByLabelText(/username:/i));
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: expect.any(String),
        })
      );
    });
  });

  test("handles successful admin creation", async () => {
    // Mock the API response
    axios.mockResolvedValueOnce({
      data: { message: "Admin created successfully" },
    });

    render(<ManageAdminsModal {...mockProps} />);

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/full name:/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/username:/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText(/birthday:/i), {
      target: { value: "1990-01-01" },
    });

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /create/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for the API call
    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: "POST",
        url: expect.any(String),
        data: expect.objectContaining({
          fullName: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          password: "Password123!",
          dob: "1990-01-01",
        }),
      });
    });

    // Verify success message
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Success!",
        text: expect.any(String),
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        customClass: {
          popup: "border border-slate-700",
        },
      })
    );

    // Verify callbacks
    expect(mockProps.onAdminCreated).toHaveBeenCalled();
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test("handles validation errors", async () => {
    render(<ManageAdminsModal {...mockProps} />);

    // Submit form without filling in required fields
    const submitButton = screen.getByRole("button", { name: /create/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify validation error message
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

    // Verify API was not called
    expect(axios).not.toHaveBeenCalled();
  });

  test("handles API error", async () => {
    // Mock API error
    const errorMessage = "Server error";
    axios.mockRejectedValueOnce({
      response: {
        status: 500,
        message: errorMessage,
      },
    });

    render(<ManageAdminsModal {...mockProps} />);

    // Fill form with valid data

    fireEvent.change(screen.getByLabelText(/full name:/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/username:/i), {
      target: { value: "johndoe" },
    });
    fireEvent.change(screen.getByLabelText(/email:/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password:/i), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText(/birthday:/i), {
      target: { value: "1990-01-01" },
    });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /create/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify error message
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          text: expect.stringContaining("500"),
          icon: "error",
          background: "#1e293b",
          color: "#fff",
          customClass: {
            popup: "border border-slate-700",
          },
        })
      );
    });
  });

  test("handles password visibility toggle", () => {
    render(<ManageAdminsModal {...mockProps} />);

    // Get the password input
    const passwordInput = screen.getByLabelText(/password:/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    // Find the toggle button by its aria-label
    const toggleButton = screen.getByLabelText(/toggle password visibility/i);
    fireEvent.click(toggleButton);

    // Check if password is now visible
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("handles form reset on close", () => {
    const { rerender } = render(<ManageAdminsModal {...mockProps} />);

    // Fill in some data
    fireEvent.change(screen.getByLabelText(/full name:/i), {
      target: { value: "John Doe" },
    });

    // Close the modal
    rerender(<ManageAdminsModal {...mockProps} isOpen={false} />);

    // Reopen the modal
    rerender(<ManageAdminsModal {...mockProps} isOpen={true} />);

    // Check if form was reset
    expect(screen.getByLabelText(/full name:/i).value).toBe("");
  });

  test("renders correctly for update type", () => {
    render(<ManageAdminsModal {...mockProps} type="update" />);

    // Check for update-specific fields
    expect(screen.getByLabelText(/admin id:/i)).toBeInTheDocument();
    expect(screen.getByText(/update admin/i)).toBeInTheDocument();
  });

  test("renders correctly for delete type", () => {
    render(<ManageAdminsModal {...mockProps} type="delete" />);

    // Check for delete-specific elements
    expect(screen.getByLabelText(/admin id:/i)).toBeInTheDocument();
    expect(screen.getByText(/delete admin/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/full name:/i)).not.toBeInTheDocument();
  });
});
