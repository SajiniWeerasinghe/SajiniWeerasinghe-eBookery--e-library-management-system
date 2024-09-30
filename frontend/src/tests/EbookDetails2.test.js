import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for jest-dom matchers
import EbookManagement from "../components/EbookManagement"; // Adjust the import to your file structure
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockEbooks = [
  { _id: "1", name: "Ebook 1", authors: ["Author 1"], section: { name: "Section 1" } },
];

const mockSections = [
  { _id: "s1", name: "Section 1" },
];

describe("EbookManagement", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockEbooks });
    axios.get.mockResolvedValueOnce({ data: mockSections });
  });

  it("opens feedback modal when 'Give Feedback' button is clicked", () => {
    const token = "sample-token";
    render(
      <AppContext.Provider value={{ token }}>
        <EbookManagement />
      </AppContext.Provider>
    );

    // Wait for the components to render
    const addButton = screen.getByText(/add e-book/i);
    expect(addButton).toBeInTheDocument();

    // Simulate opening the modal
    const giveFeedbackButton = screen.getByText("Give Feedback");
    fireEvent.click(giveFeedbackButton);

    // Check if the modal is open
    expect(screen.getByText(/feedback/i)).toBeInTheDocument();
  });

  it("submits feedback successfully and closes the modal", async () => {
    const token = "sample-token";
    render(
      <AppContext.Provider value={{ token }}>
        <EbookManagement />
      </AppContext.Provider>
    );

    // Simulate opening the modal
    const giveFeedbackButton = screen.getByText("Give Feedback");
    fireEvent.click(giveFeedbackButton);

    // Simulate feedback input
    const feedbackInput = screen.getByLabelText(/your feedback/i);
    fireEvent.change(feedbackInput, { target: { value: "Great platform!" } });

    // Simulate form submission
    const submitButton = screen.getByText("Submit");
    axios.post.mockResolvedValueOnce({ data: { msg: "Feedback submitted successfully" } });

    fireEvent.click(submitButton);

    // Wait for feedback submission and modal close
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Feedback submitted successfully"));

    // Check if modal is closed
    await waitFor(() => expect(screen.queryByText(/feedback/i)).not.toBeInTheDocument());
  });

  it("closes the feedback modal when 'Close' button is clicked", () => {
    const token = "sample-token";
    render(
      <AppContext.Provider value={{ token }}>
        <EbookManagement />
      </AppContext.Provider>
    );

    // Simulate opening the modal
    const giveFeedbackButton = screen.getByText("Give Feedback");
    fireEvent.click(giveFeedbackButton);

    // Simulate closing the modal
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    // Check if the modal is closed
    expect(screen.queryByText(/feedback/i)).not.toBeInTheDocument();
  });
});
