import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Login from "../components/Login";
import { toast } from "react-toastify";

// Mocking axios
const mockAxios = new MockAdapter(axios);

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Login Component Test Suite", () => {
  const dispatchMock = jest.fn();
  
  const renderLogin = () => {
    render(
      <AppContext.Provider value={{ role: null, dispatch: dispatchMock }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AppContext.Provider>
    );
  };

  beforeEach(() => {
    dispatchMock.mockClear();
    mockAxios.reset();
  });

  // UT_09 - Verify login with valid credentials
  test("UT_09 - Verify login with valid credentials", async () => {
    renderLogin();
    mockAxios.onPost("http://localhost:5000/api/auth/login").reply(200, {
      token: "fakeToken",
      user: { role: "user" },
    });

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "validUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "validPassword" },
    });

    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText(/Login successful!/)).toBeInTheDocument();
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "LOGIN_SUCCESS",
      payload: { token: "fakeToken", role: "user" },
    });
  });

  // UT_10 - Verify that a user log in with an incorrect password
  test("UT_10 - Verify that a user log in with an incorrect password", async () => {
    renderLogin();
    mockAxios.onPost("http://localhost:5000/api/auth/login").reply(401, {
      msg: "Incorrect password",
    });

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "validUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "invalidPassword" },
    });

    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText(/Incorrect password/)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Incorrect password");
  });

  // UT_11 - Verify that a user log in with an incorrect username
  test("UT_11 - Verify that a user log in with an incorrect username", async () => {
    renderLogin();
    mockAxios.onPost("http://localhost:5000/api/auth/login").reply(401, {
      msg: "Username not found",
    });

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "invalidUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "validPassword" },
    });

    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText(/Username not found/)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Username not found");
  });

  // UT_12 - Verify login with both fields empty
  test("UT_12 - Verify login with both fields empty", async () => {
    renderLogin();
    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText(/Error during login/)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Error during login");
  });

  // UT_13 - Verify login with only Username filled
  test("UT_13 - Verify login with only Username filled", async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "validUser" },
    });

    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText(/Error during login/)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Error during login");
  });

  // UT_14 - Verify login with only Password filled
  test("UT_14 - Verify login with only Password filled", async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "validPassword" },
    });

    fireEvent.click(screen.getByText("Login"));

    expect(await screen.findByText(/Error during login/)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Error during login");
  });
});
