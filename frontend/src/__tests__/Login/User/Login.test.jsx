import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../components/Login/Login";

// Mock the Forms component
jest.mock("../../components/Login/Forms", () => {
  return function DummyForms() {
    return <div>Mocked Forms Component</div>;
  };
});

describe("Login Component", () => {
  test("renders login and register buttons", () => {
    render(<Login />);
    expect(screen.getByTestId("user-login-button")).toBeInTheDocument();
    expect(screen.getByTestId("user-register-button")).toBeInTheDocument();
  });

  test('opens login popup on "Log In" button click', () => {
    render(<Login />);
    fireEvent.click(screen.getByTestId("user-login-button"));
    expect(screen.getByText("Mocked Forms Component")).toBeInTheDocument();
  });

  test('opens register popup on "Register" button click', () => {
    render(<Login />);
    fireEvent.click(screen.getByTestId("user-register-button"));
    expect(screen.getByText("Mocked Forms Component")).toBeInTheDocument();
  });

  test("opens admin login popup", () => {
    render(<Login />);
    fireEvent.click(screen.getByTestId("admin-login-button"));
    expect(screen.getByText("Mocked Forms Component")).toBeInTheDocument();
  });

  test("opens admin register popup", () => {
    render(<Login />);
    fireEvent.click(screen.getByTestId("admin-register-button"));
    expect(screen.getByText("Mocked Forms Component")).toBeInTheDocument();
  });
});
