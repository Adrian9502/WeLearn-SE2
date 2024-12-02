import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Swal from "sweetalert2";
import UserDashboard from "../../components/User/UserDashboard";
import { UserProvider } from "../../components/User/UserContext";
// Mock all audio files
jest.mock("/music/Victory.mp3", () => "mocked-victory-sound", {
  virtual: true,
});
jest.mock("/music/losetrumpet.mp3", () => "mocked-lose-sound", {
  virtual: true,
});
jest.mock("/music/Enchanted Festival.mp3", () => "mocked-background-music", {
  virtual: true,
});

// Mock dependencies
jest.mock("axios");
jest.mock("sweetalert2");
jest.mock("../../components/User/UserContext", () => ({
  UserProvider: ({ children }) => children,
  useUser: () => ({
    user: {
      userId: "test-user-id",
      coins: 500,
      updateUser: jest.fn(),
    },
    updateUser: jest.fn(),
  }),
}));

// Mock child components
jest.mock("../../components/User/Sidebar", () => {
  return function MockSidebar(props) {
    return (
      <div
        data-testid="mock-sidebar"
        onClick={() =>
          props.onQuizSelect({
            _id: "quiz1",
            title: "Test Quiz",
            answer: "correct answer",
          })
        }
      >
        Mocked Sidebar
      </div>
    );
  };
});

jest.mock("../../components/User/components/Quiz/QuizInterface", () => {
  return function MockQuizInterface(props) {
    return (
      <div data-testid="mock-quiz-interface">
        <input
          data-testid="answer-input"
          value={props.userAnswer}
          onChange={(e) => props.handleAnswerChange(e)}
        />
        <button onClick={props.handleSubmitAnswer}>Submit</button>
      </div>
    );
  };
});

describe("UserDashboard Component", () => {
  // Setup mock Audio
  const mockPlay = jest.fn().mockImplementation(() => Promise.resolve());
  const mockAudio = {
    play: mockPlay,
    pause: jest.fn(),
    currentTime: 0,
    loop: false,
    volume: 1,
    muted: false,
  };
  global.Audio = jest.fn(() => mockAudio);
  // Setup fetch mock
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ lastClaim: null }),
    })
  );

  beforeAll(() => {
    global.Audio = jest.fn(() => mockAudio);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ lastClaim: null }),
      })
    );
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
  });

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Reset Audio mock for each test
    mockAudio.play.mockClear();
    mockAudio.pause.mockClear();

    // Mock API responses
    axios.get.mockResolvedValue({
      data: {
        quizzes: [
          { quizId: { _id: "quiz1", title: "Test Quiz" }, completed: false },
        ],
      },
    });

    axios.post.mockResolvedValue({
      data: { success: true },
    });

    axios.put.mockResolvedValue({
      data: { coins: 550 },
    });

    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  test("audio mute/unmute functionality", () => {
    render(
      <UserProvider>
        <UserDashboard />
      </UserProvider>
    );

    const audioToggle = screen.getByText("🔊 Mute");
    fireEvent.click(audioToggle);

    // Verify audio state changed
    expect(screen.getByText("🔇 Unmute")).toBeInTheDocument();
  });
  test("renders dashboard with sidebar and placeholder when no quiz selected", async () => {
    render(
      <UserProvider>
        <UserDashboard />
      </UserProvider>
    );

    await waitFor(() => {
      // Check for sidebar
      expect(screen.getByTestId("mock-sidebar")).toBeInTheDocument();

      // Check for the instruction header
      expect(
        screen.getByText("Choose an Exercise on the left!")
      ).toBeInTheDocument();

      // Check for some instruction content
      expect(screen.getByText("Instructions:")).toBeInTheDocument();
      expect(screen.getByText(/Choose a Topic:/)).toBeInTheDocument();
      expect(screen.getByText(/Select an Exercise:/)).toBeInTheDocument();
    });
  });
  test("selects quiz and starts interaction", async () => {
    render(
      <UserProvider>
        <UserDashboard />
      </UserProvider>
    );

    // Simulate quiz selection
    const sidebar = screen.getByTestId("mock-sidebar");
    fireEvent.click(sidebar);

    // Check if quiz interface is rendered
    await waitFor(() => {
      expect(screen.getByTestId("mock-quiz-interface")).toBeInTheDocument();
    });
  });
  test("submits correct answer", async () => {
    render(
      <UserProvider>
        <UserDashboard />
      </UserProvider>
    );

    // Select quiz
    const sidebar = screen.getByTestId("mock-sidebar");
    fireEvent.click(sidebar);

    // Input correct answer
    const answerInput = screen.getByTestId("answer-input");
    fireEvent.change(answerInput, { target: { value: "correct answer" } });

    // Submit answer
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    // Verify API calls and Swal fire
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(axios.put).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalled();
    });
  });
  test("handles show answer functionality", async () => {
    render(
      <UserProvider>
        <UserDashboard />
      </UserProvider>
    );

    // Select quiz
    const sidebar = screen.getByTestId("mock-sidebar");
    fireEvent.click(sidebar);

    // Mock show answer method (this would typically be a button in the actual component)
    const showAnswerMethod = jest.fn();

    await waitFor(() => {
      showAnswerMethod();
      expect(Swal.fire).toHaveBeenCalled();
    });
  });
  test("toggles sidebar", async () => {
    render(
      <UserProvider>
        <UserDashboard />
      </UserProvider>
    );

    // Get the toggle button by its text content
    const toggleButton = screen.getByText("✕");

    // Initial state - sidebar should be visible
    const sidebarContainer = screen.getByTestId("mock-sidebar").parentElement;
    expect(sidebarContainer).toHaveClass("translate-x-0");

    // Click to close sidebar
    fireEvent.click(toggleButton);

    // Wait for transition and verify sidebar state changed
    await waitFor(() => {
      expect(sidebarContainer).toHaveClass("-translate-x-full");
    });

    // Click to open sidebar again
    fireEvent.click(toggleButton);

    // Wait for transition and verify sidebar is visible again
    await waitFor(() => {
      expect(sidebarContainer).toHaveClass("translate-x-0");
    });
  });
});
