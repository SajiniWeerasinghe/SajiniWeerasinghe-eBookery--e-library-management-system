import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EbookManagement from "../EbookManagement";
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

describe("EbookManagement Component", () => {
  const mockToken = "test-token";
  const mockContextValue = {
    token: mockToken,
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          name: "Test Ebook",
          content: "Test content",
          authors: ["Author1", "Author2"],
          section: { _id: "1", name: "Fiction" },
        },
      ],
    });
    axios.post.mockResolvedValue({ data: { success: true } });
    axios.put.mockResolvedValue({ data: { success: true } });
  });

  it("opens and closes the feedback modal correctly", async () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <EbookManagement />
      </AppContext.Provider>
    );

    // Initially the modal should not be visible
    expect(screen.queryByText(/Edit E-book/i)).not.toBeInTheDocument();

    // Open the modal by clicking the "Give Feedback" button
    const giveFeedbackButton = screen.getByText(/Add New E-book/i);
    fireEvent.click(giveFeedbackButton);

    // Now the modal should be visible
    const modalTitle = await screen.findByText(/Edit E-book/i);
    expect(modalTitle).toBeInTheDocument();

    // Close the modal by clicking the "Close" button
    const closeButton = screen.getByText(/Cancel/i);
    fireEvent.click(closeButton);

    // The modal should no longer be visible
    expect(screen.queryByText(/Edit E-book/i)).not.toBeInTheDocument();
  });

  it("submits feedback successfully", async () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <EbookManagement />
      </AppContext.Provider>
    );

    // Open the modal by clicking the "Add New E-book" button
    const addNewEbookButton = screen.getByText(/Add New E-book/i);
    fireEvent.click(addNewEbookButton);

    // Fill out the form fields
    const nameField = screen.getByLabelText(/E-book Name/i);
    fireEvent.change(nameField, { target: { value: "New Ebook" } });

    const contentField = screen.getByLabelText(/Content/i);
    fireEvent.change(contentField, { target: { value: "Ebook content" } });

    const authorsField = screen.getByLabelText(/Authors/i);
    fireEvent.change(authorsField, { target: { value: "Author1, Author2" } });

    const sectionField = screen.getByLabelText(/Section/i);
    fireEvent.change(sectionField, { target: { value: "1" } }); // Assuming section ID is 1

    // Submit the feedback form
    const submitButton = screen.getByText(/Add E-book/i);
    fireEvent.click(submitButton);

    // Verify if the success toast was called
    expect(toast.success).toHaveBeenCalledWith("E-book added successfully");

    // Close the modal after submission
    const closeButton = screen.getByText(/Cancel/i);
    fireEvent.click(closeButton);

    // Ensure the modal is closed
    expect(screen.queryByText(/Edit E-book/i)).not.toBeInTheDocument();
  });
});
