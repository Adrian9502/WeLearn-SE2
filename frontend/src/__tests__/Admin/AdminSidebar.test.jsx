import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminSidebar from "../../components/Admin/AdminSidebar";

// Mock the required modules
jest.mock("axios");
jest.mock("sweetalert2");

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/admin-dashboard/" }),
}));

describe("AdminSidebar", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      const storage = {
        adminId: "123",
        username: "TestAdmin",
        authToken: "test-token",
      };
      return storage[key];
    });

    // Mock successful profile picture fetch
    axios.get.mockResolvedValue({
      data: { profilePicture: "/uploads/test-profile.jpg" },
    });
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };
  test("renders sidebar with admin information", async () => {
    renderWithRouter(<AdminSidebar />);

    // Check if username is displayed
    const username = screen.getByTestId("admin-username");
    expect(username).toHaveTextContent("TestAdmin");

    // Check if all navigation links are present
    expect(screen.getByTestId("nav-link-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-manage-quizzes")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-manage-users")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-manage-admins")).toBeInTheDocument();
  });

  test("handles logout process", async () => {
    // Mock both Swal.fire calls
    Swal.fire
      .mockResolvedValueOnce({ isConfirmed: true }) // First call: confirmation dialog
      .mockResolvedValueOnce(); // Second call: success message

    // Mock successful logout response
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    renderWithRouter(<AdminSidebar />);

    const logoutButton = screen.getByTestId("logout-button");
    fireEvent.click(logoutButton);

    // Wait for the confirmation dialog
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenNthCalledWith(1, {
        title: "Are you sure?",
        text: "You will be logged out of the admin dashboard",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout",
        background: "#1e293b",
        color: "#fff",
      });
    });

    // Wait for the success message
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenNthCalledWith(2, {
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        showConfirmButton: false,
        timer: 1500,
      });
    });

    // Wait for the logout API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/api/logout",
        {},
        { withCredentials: true }
      );
    });

    // Wait for navigation to occur
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  test("handles profile picture update", async () => {
    renderWithRouter(<AdminSidebar />);

    const file = new File(["test"], "test.png", { type: "image/png" });
    const fileInput = screen.getByTestId("profile-picture-input");

    axios.put.mockResolvedValueOnce({
      data: { profilePicture: "/uploads/new-profile.jpg" },
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Success",
          text: "Profile picture updated successfully",
        })
      );
    });
  });

  test("toggles sidebar on mobile menu button click", () => {
    renderWithRouter(<AdminSidebar />);

    const menuButton = screen.getByTestId("mobile-menu-button");
    const sidebar = screen.getByTestId("admin-sidebar");

    fireEvent.click(menuButton);
    expect(sidebar).toHaveClass("translate-x-0");

    fireEvent.click(menuButton);
    expect(sidebar).toHaveClass("-translate-x-full");
  });

  test("handles profile picture fetch error", async () => {
    axios.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    renderWithRouter(<AdminSidebar />);

    await waitFor(() => {
      const profileImg = screen.getByTestId("admin-profile-image");
      expect(profileImg.src).toContain("default-profile.png");
    });
  });

  test("displays correct admin logo", () => {
    renderWithRouter(<AdminSidebar />);

    const logo = screen.getByTestId("admin-logo");
    expect(logo).toHaveTextContent("WeLearn Admin");
  });

  test("profile picture container shows hover state", () => {
    renderWithRouter(<AdminSidebar />);

    const container = screen.getByTestId("profile-picture-container");
    fireEvent.mouseEnter(container);

    // Check if hover overlay is visible
    const overlay = container.querySelector('div[class*="opacity-100"]');
    expect(overlay).toBeInTheDocument();

    fireEvent.mouseLeave(container);
    expect(
      container.querySelector('div[class*="opacity-0"]')
    ).toBeInTheDocument();
  });
});
