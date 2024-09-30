// UserProfile.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserProfile from "../components/UserProfile";
import { AppContext } from "../context/AppContext";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Mock axios and toast
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUserData = {
  username: "JohnDoe",
  email: "john@example.com",
};

describe("UserProfile Component", () => {
  const token = "mock-token";
  const mockLogout = jest.fn();
  const renderComponent = () =>
    render(
      <AppContext.Provider value={{ token, logout: mockLogout }}>
        <Router>
          <UserProfile />
        </Router>
      </AppContext.Provider>
    );

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockUserData });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Clicking 'Edit' button enables edit mode", async () => {
    renderComponent();

    // Wait for the user data to be loaded
    await waitFor(() => {
      expect(screen.getByDisplayValue("JohnDoe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });

    // Ensure inputs are disabled initially
    expect(screen.getByLabelText("Username")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();

    // Click "Edit Profile" button
    const editButton = screen.getByRole("button", { name: /edit profile/i });
    fireEvent.click(editButton);

    // Ensure inputs are now enabled
    expect(screen.getByLabelText("Username")).not.toBeDisabled();
    expect(screen.getByLabelText("Email")).not.toBeDisabled();
  });

  test("Updating the user profile", async () => {
    axios.put.mockResolvedValue({});

    renderComponent();

    // Wait for the user data to be loaded
    await waitFor(() => {
      expect(screen.getByDisplayValue("JohnDoe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });

    // Click "Edit Profile" button to enable edit mode
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    // Update username and email
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "JaneDoe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@example.com" },
    });

    // Click "Preview Changes" button
    fireEvent.click(screen.getByRole("button", { name: /preview changes/i }));

    // Confirm the preview shows updated values
    await waitFor(() => {
      expect(screen.getByText("Username: JaneDoe")).toBeInTheDocument();
      expect(screen.getByText("Email: jane@example.com")).toBeInTheDocument();
    });

    // Confirm changes
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    // Wait for update and check success toast
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:5000/api/user/me",
        { username: "JaneDoe", email: "jane@example.com", password: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      expect(toast.success).toHaveBeenCalledWith("Profile updated successfully");
    });
  });

  test("Clicking 'Cancel' button exits edit mode without saving changes", async () => {
    renderComponent();

    // Wait for the user data to be loaded
    await waitFor(() => {
      expect(screen.getByDisplayValue("JohnDoe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });

    // Click "Edit Profile" button to enable edit mode
    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    // Update username and email
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "JaneDoe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@example.com" },
    });

    // Click "Cancel" button to discard changes
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // Ensure the original values are restored and inputs are disabled again
    expect(screen.getByDisplayValue("JohnDoe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  test("Clicking 'Delete Account' button opens delete confirmation dialog", async () => {
    renderComponent();

    // Switch to "Account Settings" tab
    fireEvent.click(screen.getByRole("tab", { name: /account settings/i }));

    // Click "Delete Account" button
    fireEvent.click(screen.getByRole("button", { name: /delete account/i }));

    // Ensure the delete confirmation dialog appears
    await waitFor(() => {
      expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();
      expect(screen.getByText(/are you sure you want to delete your account/i)).toBeInTheDocument();
    });

    // Confirm delete
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    // Wait for delete and check logout is called
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:5000/api/user/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      expect(mockLogout).toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });
  });
});
