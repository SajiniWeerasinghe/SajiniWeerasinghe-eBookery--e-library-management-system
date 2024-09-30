// FeedbackManagement.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FeedbackManagement from "../components/FeedbackManagement";
import { AppContext } from "../context/AppContext";
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

const mockFeedbacks = [
  { _id: "1", ebook: "Book A", username: "user1", comment: "Great book", rating: 5 },
  { _id: "2", ebook: "Book B", username: "user2", comment: "Average book", rating: 3 },
];

describe("FeedbackManagement Component", () => {
  const token = "mock-token";
  
  const renderComponent = () =>
    render(
      <AppContext.Provider value={{ token }}>
        <FeedbackManagement />
      </AppContext.Provider>
    );

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockFeedbacks });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Clicking delete button opens confirmation dialog", async () => {
    renderComponent();

    // Wait for feedbacks to be loaded
    await waitFor(() => {
      expect(screen.getByText("Book A")).toBeInTheDocument();
    });

    // Click delete button for first feedback
    const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    // Check if the dialog is opened with correct details
    expect(screen.getByText("Delete Feedback")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this feedback?")
    ).toBeInTheDocument();
  });

  test("Confirming delete action removes the feedback and shows success message", async () => {
    axios.delete.mockResolvedValueOnce({});

    renderComponent();

    // Wait for feedbacks to be loaded
    await waitFor(() => {
      expect(screen.getByText("Book A")).toBeInTheDocument();
    });

    // Click delete button for first feedback
    const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    // Confirm the delete action
    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Wait for the delete request to complete and feedback to be removed
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:5000/api/librarian/feedbacks/1",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      expect(screen.queryByText("Book A")).not.toBeInTheDocument();
    });

    // Check if success message is shown
    expect(toast.success).toHaveBeenCalledWith("Feedback deleted successfully");
  });

  test("Canceling delete action closes the dialog without deleting", async () => {
    renderComponent();

    // Wait for feedbacks to be loaded
    await waitFor(() => {
      expect(screen.getByText("Book A")).toBeInTheDocument();
    });

    // Click delete button for first feedback
    const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    // Cancel the delete action
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    // Ensure the dialog is closed and feedback is still present
    expect(screen.queryByText("Delete Feedback")).not.toBeInTheDocument();
    expect(screen.getByText("Book A")).toBeInTheDocument();
    expect(axios.delete).not.toHaveBeenCalled();
  });
});
