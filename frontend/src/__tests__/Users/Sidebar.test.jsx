import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";
import Swal from "sweetalert2";
import { UserProvider } from "../../components/User/UserContext";
import Sidebar from "../../components/User/Sidebar";

// Mock data
const mockUser = {
  user: {
    username: "testuser",
    userId: "user123",
    coins: 100,
  },
};

const mockQuizzes = [
  {
    _id: "QZ0001",
    title: "Bubble Sort 1",
    category: "Sorting Algorithms",
    type: "Bubble Sort",
    difficulty: "Easy",
  },
  {
    _id: "QZ0002",
    title: "Bubble Sort 21",
    category: "Sorting Algorithms",
    type: "Bubble Sort",
    difficulty: "Medium",
  },
];

// Mock dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("../../components/User/UserContext", () => ({
  UserProvider: ({ children }) => children,
  useUser: () => mockUser,
}));

jest.mock("../../components/User/components/Sidebar/UserInfo", () => {
  return function MockUserInfo(props) {
    return (
      <div data-testid="mock-user-info">
        <button onClick={props.onLogout}>Logout</button>
        <span>{props.username}</span>
        <span>{props.coins}</span>
      </div>
    );
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Create mock fetch
const createMockFetch = () => {
  return jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockQuizzes),
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            username: "testuser",
            coins: 100,
          }),
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            quizzes: [
              { quizId: "quiz1", completed: true },
              { quizId: "quiz2", completed: false },
            ],
          }),
      })
    );
};

describe("Sidebar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    global.fetch = createMockFetch();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      onQuizSelect: jest.fn(),
      userProgress: [
        { quizId: { _id: "quiz1" }, completed: true },
        { quizId: { _id: "quiz2" }, completed: false },
      ],
      onShowProgress: jest.fn(),
      onShowRankings: jest.fn(),
      onShowDailyRewards: jest.fn(),
      onClose: jest.fn(),
      completedQuizzes: new Set(["quiz1"]),
    };

    return render(
      <MemoryRouter>
        <UserProvider>
          <Sidebar {...defaultProps} {...props} />
        </UserProvider>
      </MemoryRouter>
    );
  };

  test("logout functionality", async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockNavigate);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    renderComponent();

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: "Log out?",
      width: 500,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "YES",
      cancelButtonText: "NO",
      padding: "1em",
      color: "#c3e602",
      background:
        "#fff url(https://cdn.vectorstock.com/i/1000v/38/53/pixel-art-style-purple-gradient-background-vector-8473853.jpg",
      customClass: {
        popup: "swal-font",
        confirmButton: "btn-swal primary",
        cancelButton: "btn-swal show-btn",
      },
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    const localStorageKeys = [
      "authToken",
      "userRole",
      "username",
      "coins",
      "userId",
    ];

    localStorageKeys.forEach((key) => {
      expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    });
  });

  test("renders sidebar with logo and title", async () => {
    renderComponent();

    // Wait for async operations
    await waitFor(() => {
      expect(screen.getByAltText("WeLearn logo")).toBeInTheDocument();
      expect(
        screen.getByText("Master Sorting Algorithm & Binary Operations")
      ).toBeInTheDocument();
    });
  });

  test("displays user quiz completion progress", async () => {
    renderComponent();

    await waitFor(() => {
      const completedQuizText = screen.getByText(/of/);
      expect(completedQuizText).toBeInTheDocument();
    });
  });
  test("user information is displayed", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument(); // Coins
    });
  });

  test("quiz selection calls onQuizSelect", async () => {
    const mockOnQuizSelect = jest.fn();
    renderComponent({ onQuizSelect: mockOnQuizSelect });

    // Wait for the component to load and find the main category
    await waitFor(() => {
      expect(screen.getByText("Sorting Algorithms")).toBeInTheDocument();
    });

    // Click on "Sorting Algorithms" to expand
    const categoryButton = screen.getByText("Sorting Algorithms");
    fireEvent.click(categoryButton);

    // Wait for and click on "Bubble Sort" type
    await waitFor(() => {
      const typeButton = screen.getByText("Bubble Sort");
      fireEvent.click(typeButton);
    });

    // Wait for and click on "Easy" difficulty
    await waitFor(() => {
      const difficultyButton = screen.getByText("Easy");
      fireEvent.click(difficultyButton);
    });

    // Wait for and click on the specific quiz
    await waitFor(() => {
      const quizButton = screen.getByText("Bubble Sort 1");
      fireEvent.click(quizButton);
    });

    // Verify the correct quiz was selected
    expect(mockOnQuizSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "QZ0001",
        title: "Bubble Sort 1",
        category: "Sorting Algorithms",
        type: "Bubble Sort",
        difficulty: "Easy",
      })
    );
  });

  test("renders quiz categories and types", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Sorting Algorithms")).toBeInTheDocument();
      expect(screen.getByText("Bubble Sort")).toBeInTheDocument();
    });
  });

  test("can expand and collapse quiz sections", async () => {
    renderComponent();

    await waitFor(() => {
      const typeButton = screen.getByText("Bubble Sort");
      fireEvent.click(typeButton);

      const difficultyButton = screen.getByText("Easy");
      expect(difficultyButton).toBeInTheDocument();
    });
  });
});
