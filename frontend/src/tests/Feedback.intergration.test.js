import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import FeedbackManagement from "../components/FeedbackManagement";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// Mocking axios and toast
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("FeedbackManagement Integration Tests", () => {
  const feedbacks = [
    {
      _id: "1",
      ebook: "Ebook One",
      username: "Reader1",
      comment: "Great book!",
      rating: 5,
    },
    {
      _id: "2",
      ebook: "Ebook Two",
      username: "Reader2",
      comment: "Very informative.",
      rating: 4,
    },
  ];

  const mockToken = "test-token";

  const renderComponent = () => {
    return render(
      <AppContext.Provider value={{ token: mockToken }}>
        <FeedbackManagement />
      </AppContext.Provider>
    );
  };

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: feedbacks });
  });

  it("should fetch and display feedbacks on load", async () => {
    renderComponent();

    // Verify that feedbacks are displayed
    await waitFor(() => {
      expect(screen.getByText("Ebook One")).toBeInTheDocument();
      expect(screen.getByText("Reader1")).toBeInTheDocument();
      expect(screen.getByText("Great book!")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    expect(screen.getByText("Ebook Two")).toBeInTheDocument();
    expect(screen.getByText("Reader2")).toBeInTheDocument();
    expect(screen.getByText("Very informative.")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("should delete feedback when delete button is clicked", async () => {
    axios.delete.mockResolvedValueOnce({});

    renderComponent();

    // Wait for feedbacks to load
    await waitFor(() => {
      expect(screen.getByText("Ebook One")).toBeInTheDocument();
    });

    // Click the delete button on the first feedback
    const deleteButton = screen.getAllByRole("button")[0];
    fireEvent.click(deleteButton);

    // Confirm delete
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    // Wait for deletion and feedback update
    await waitFor(() => {
      expect(screen.queryByText("Ebook One")).not.toBeInTheDocument();
    });

    // Verify toast success message
    expect(toast.success).toHaveBeenCalledWith("Feedback deleted successfully");
  });

  it("should show error message if delete fails", async () => {
    axios.delete.mockRejectedValueOnce(new Error("Delete failed"));

    renderComponent();

    // Wait for feedbacks to load
    await waitFor(() => {
      expect(screen.getByText("Ebook One")).toBeInTheDocument();
    });

    // Click the delete button on the first feedback
    const deleteButton = screen.getAllByRole("button")[0];
    fireEvent.click(deleteButton);

    // Confirm delete
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    // Wait for deletion to fail
    await waitFor(() => {
      expect(screen.getByText("Ebook One")).toBeInTheDocument(); // Feedback still exists
    });

    // Verify toast error message
    expect(toast.error).toHaveBeenCalledWith("Error deleting feedback");
  });
});
