// UserDashboard.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserDashboard from "../components/UserDashboard";
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

const mockIssuedBooks = [
  {
    _id: "1",
    name: "Book A",
    authors: ["Author 1"],
    section: "Fiction",
    dateIssued: "2023-09-01T00:00:00Z",
    returnDate: "2023-09-10T00:00:00Z",
  },
  {
    _id: "2",
    name: "Book B",
    authors: ["Author 2"],
    section: "Science",
    dateIssued: "2023-09-05T00:00:00Z",
    returnDate: "2023-09-15T00:00:00Z",
  },
];

describe("UserDashboard Component", () => {
  const token = "mock-token";

  const renderComponent = () =>
    render(
      <AppContext.Provider value={{ token }}>
        <Router>
          <UserDashboard />
        </Router>
      </AppContext.Provider>
    );

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockIssuedBooks });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Clicking 'Return Book' button returns the ebook and updates the list", async () => {
    axios.post.mockResolvedValueOnce({});

    renderComponent();

    // Wait for the issued books to be loaded
    await waitFor(() => {
      expect(screen.getByText("Book A")).toBeInTheDocument();
      expect(screen.getByText("Book B")).toBeInTheDocument();
    });

    // Click "Return Book" for the first book
    const returnButton = screen.getAllByRole("button", { name: /return book/i })[0];
    fireEvent.click(returnButton);

    // Wait for the API call and UI update
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/user/ebooks/1/return",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      expect(screen.queryByText("Book A")).not.toBeInTheDocument();
    });

    // Ensure success toast is shown
    expect(toast.success).toHaveBeenCalledWith("Ebook returned successfully");
  });

  test("Clicking 'Open Ebook' button navigates to the ebook detail page", async () => {
    const navigateMock = jest.fn();

    jest.mock("react-router-dom", () => ({
      useNavigate: () => navigateMock,
    }));

    renderComponent();

    // Wait for the issued books to be loaded
    await waitFor(() => {
      expect(screen.getByText("Book A")).toBeInTheDocument();
      expect(screen.getByText("Book B")).toBeInTheDocument();
    });

    // Click "Open Ebook" for the first book
    const openEbookButton = screen.getAllByRole("button", { name: /open ebook/i })[0];
    fireEvent.click(openEbookButton);

    // Check if navigate function was called with correct ebook ID
    expect(navigateMock).toHaveBeenCalledWith("/ebook/1");
  });
});
