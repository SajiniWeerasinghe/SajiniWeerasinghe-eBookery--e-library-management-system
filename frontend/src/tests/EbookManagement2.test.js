import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import EbookManagement from "../components/EbookManagement";
import { toast } from "react-toastify";

// Mock axios and toast
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockEbooks = [
  {
    _id: "1",
    name: "Test E-book",
    content: "E-book content",
    authors: ["John Doe", "Jane Doe"],
    section: { _id: "sec1", name: "Section 1" },
  },
];

const mockSections = [
  { _id: "sec1", name: "Section 1" },
  { _id: "sec2", name: "Section 2" },
];

describe("EbookManagement", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockEbooks }); // Mock e-books API response
    axios.get.mockResolvedValueOnce({ data: mockSections }); // Mock sections API response
  });

  test("should allow a user to edit an e-book", async () => {
    const token = "mock-token";

    render(
      <AppContext.Provider value={{ token }}>
        <EbookManagement />
      </AppContext.Provider>
    );

    // Wait for the e-books to load
    await waitFor(() => expect(screen.getByText("Test E-book")).toBeInTheDocument());

    // Find and click the Edit button
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Wait for the dialog to open
    await waitFor(() => expect(screen.getByLabelText("E-book Name")).toBeInTheDocument());

    // Change the e-book name
    const nameInput = screen.getByLabelText("E-book Name");
    fireEvent.change(nameInput, { target: { value: "Updated E-book Name" } });

    // Mock the API response for updating the e-book
    axios.put.mockResolvedValueOnce({
      data: { ...mockEbooks[0], name: "Updated E-book Name" },
    });

    // Click the Update button
    const updateButton = screen.getByRole("button", { name: /update/i });
    fireEvent.click(updateButton);

    // Assert that the update API was called with the correct data
    await waitFor(() =>
      expect(axios.put).toHaveBeenCalledWith(
        `http://localhost:5000/api/librarian/ebooks/1`,
        {
          _id: "1",
          name: "Updated E-book Name",
          content: "E-book content",
          authors: ["John Doe", "Jane Doe"],
          section: "sec1",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    );

    // Assert that a success toast was shown
    expect(toast.success).toHaveBeenCalledWith("E-book updated successfully");

    // Assert that the updated e-book name is displayed in the list
    await waitFor(() =>
      expect(screen.getByText("Updated E-book Name")).toBeInTheDocument()
    );
  });
});
