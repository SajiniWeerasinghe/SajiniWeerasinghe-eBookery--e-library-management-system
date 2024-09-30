import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../components/Register";
import { AppContext } from "../context/AppContext";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderWithContext = (dispatch) => {
  return render(
    <AppContext.Provider value={{ dispatch }}>
      <Router>
        <Register />
      </Router>
    </AppContext.Provider>
  );
};

describe("Register Component Tests", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    renderWithContext(mockDispatch);
  });

  test("Should register a user with valid details", async () => {
    axios.post.mockResolvedValue({ data: { token: "mockToken" } });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "LOGIN_SUCCESS",
        payload: { token: "mockToken", role: "user" },
      })
    );
    expect(toast.success).toHaveBeenCalledWith("Registration successful!");
  });

  test("Should show an error for already registered email", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: { errors: [{ msg: "Email already registered" }] },
      },
    });

    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "existingemail@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Email already registered")
    );
  });

  test("Should show error when username field is left blank", async () => {
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Error during registration")
    );
  });

  test("Should show error when email field is left blank", async () => {
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Error during registration")
    );
  });

  test("Should validate email format", async () => {
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Error during registration")
    );
  });

  test("Should show error when password field is left blank", async () => {
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@test.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Error during registration")
    );
  });

  test("Should show error for weak password", async () => {
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Error during registration")
    );
  });

  test("Should show error when no fields are filled", async () => {
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Error during registration")
    );
  });
});
