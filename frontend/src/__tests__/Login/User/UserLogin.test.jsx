import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserLogin from "../../../components/Login/User/UserLogin";

// Mock all external dependencies
jest.mock("@splidejs/react-splide", () => ({
  Splide: ({ children }) => <div data-testid="splide">{children}</div>,
  SplideSlide: ({ children }) => (
    <div data-testid="splide-slide">{children}</div>
  ),
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    img: ({ ...props }) => <img {...props} />,
  },
  useInView: () => ({ inView: true }),
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock the Forms component
jest.mock("../../../components/Login/User/Forms", () => {
  return function MockForms() {
    return <div data-testid="forms-component">Mocked Forms Component</div>;
  };
});

// Mock the ProfileCard component
jest.mock("../../../components/Login/User/components/ProfileCard", () => {
  return function MockProfileCard(props) {
    return <div data-testid="profile-card">Mocked Profile Card</div>;
  };
});

// Mock Audio
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};

describe("UserLogin Component", () => {
  beforeEach(() => {
    // Clear any previous renders
    jest.clearAllMocks();
  });

  test('opens register popup on "Register" button click', () => {
    render(<UserLogin />);
    fireEvent.click(screen.getByTestId("user-register-button"));
    expect(screen.getByText("Mocked Forms Component")).toBeInTheDocument();
  });

  test('opens login popup on "Login" button click', () => {
    render(<UserLogin />);
    fireEvent.click(screen.getByTestId("user-login-button"));
    expect(screen.getByText("Mocked Forms Component")).toBeInTheDocument();
  });

  it("renders login and register buttons", () => {
    const { container } = render(<UserLogin />);
    console.log(container.innerHTML); // Debug output

    const loginButton = screen.getByTestId("user-login-button");
    const registerButton = screen.getByTestId("user-register-button");

    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });
});
