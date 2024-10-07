import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../components/Login/Login"; // This is our Login component!
import axios from "axios"; // We're going to use axios to talk to our API!
import { MemoryRouter } from "react-router-dom";
jest.mock("axios"); // We pretend axios works for our tests!

describe("Login Component", () => {
  test("renders the login form", () => {
    render(
      <MemoryRouter>
        {" "}
        {/* Wrap the component */}
        <Login />
      </MemoryRouter>
    );

    // Let's see if we can find these words on the screen!
    const usernameInput = screen.getByPlaceholderText("Enter Username"); // Find the username box!
    const passwordInput = screen.getByPlaceholderText("Enter your password"); // Find the password box!
    const loginButton = screen.getByRole("button", { name: "Login" }); // Find the login button!

    // Now let's make sure everything is there!
    expect(usernameInput).toBeInTheDocument(); // Is the username box there? Yes!
    expect(passwordInput).toBeInTheDocument(); // Is the password box there? Yes!
    expect(loginButton).toBeInTheDocument(); // Is the login button there? Yes!
  });

  test("submits the form with valid inputs", async () => {
    render(
      <MemoryRouter>
        {/* Wrap the component with MemoryRouter */}
        <Login />
      </MemoryRouter>
    );

    // Get the input boxes and button
    const usernameInput = screen.getByPlaceholderText("Enter Username"); // Find the username box!
    const passwordInput = screen.getByPlaceholderText("Enter Password"); // Find the password box!
    const loginButton = screen.getByRole("button", { name: "Login" }); // Find the login button!

    // Type in our name and secret code!
    fireEvent.change(usernameInput, { target: { value: "user123" } }); // Put in "testUser"!
    fireEvent.change(passwordInput, { target: { value: "123" } }); // Put in "testPassword"!

    // We pretend that when we log in, we get a big happy message!
    axios.post.mockResolvedValue({ data: { success: true } }); // Pretend axios says "You did it!"

    // Click the login button!
    fireEvent.click(loginButton); // Push the button!

    // Now we wait and see if we got the happy message!
    const happyMessage = await screen.findByText("Login successful!"); // Check for the happy message!
    expect(happyMessage).toBeInTheDocument(); // Is the happy message on the screen? Yes!
  });

  test("shows error message with invalid inputs", async () => {
    render(
      <MemoryRouter>
        {/* Wrap the component with MemoryRouter */}
        <Login />
      </MemoryRouter>
    );

    // Get the input boxes and button
    const usernameInput = screen.getByPlaceholderText("Enter Username"); // Find the username box!
    const passwordInput = screen.getByPlaceholderText("Enter Password"); // Find the password box!
    const loginButton = screen.getByRole("button", { name: "Login" }); // Find the login button!

    // Type in our name and secret code that won't work!
    fireEvent.change(usernameInput, { target: { value: "wrongUser" } }); // Put in "wrongUser"!
    fireEvent.change(passwordInput, { target: { value: "wrongPassword" } }); // Put in "wrongPassword"!

    // We pretend that when we log in, we get a sad message!
    axios.post.mockResolvedValue({
      data: { success: false, message: "Login error:" },
    }); // Pretend axios says "Oh no!"

    // Click the login button!
    fireEvent.click(loginButton); // Push the button!

    // Now we wait and see if we got the sad message!
    const sadMessage = await screen.findByText("Login error:"); // Check for the sad message!
    expect(sadMessage).toBeInTheDocument(); // Is the sad message on the screen? Yes!
  });
});
