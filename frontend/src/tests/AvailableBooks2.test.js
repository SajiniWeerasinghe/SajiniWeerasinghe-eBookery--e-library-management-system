import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "react-toastify";
import AvailableBooks from "../components/AvailableBooks";
import { AppContext } from "../context/AppContext";

// Mock axios and toast
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockBooks = [
  {
    _id: "1",
    name: "Book One",
    authors: ["Author One"],
    section: { name: "Fiction" },
  },
  {
    _id: "2",
    name: "Book Two",
    authors: ["Author Two"],
    section: { name: "Non-Fiction" },
  },
];

const renderComponent = (token = "fakeToken") => {
  render(
    <AppContext.Provider value={{ token }}>
      <AvailableBooks />
    </AppContext.Provider>
  );
};

describe("AvailableBooks Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockBooks });
  });

  it("should render books on load", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Book One")).toBeInTheDocument();
      expect(screen.getByText("Author One")).toBeInTheDocument();
    });
  });

  it("should search books by name", async () => {
    renderComponent();

    await waitFor(() => screen.getByText("Book One"));

    fireEvent.change(screen.getByLabelText("Search Book Name"), {
      target: { value: "Book One" },
    });

    await waitFor(() => {
      expect(screen.getByText("Book One")).toBeInTheDocument();
      expect(screen.queryByText("Book Two")).not.toBeInTheDocument();
    });
  });

  it("should search books by author", async () => {
    renderComponent();

    await waitFor(() => screen.getByText("Book One"));

    fireEvent.change(screen.getByLabelText("Search Author Name"), {
      target: { value: "Author Two" },
    });

    await waitFor(() => {
      expect(screen.getByText("Book Two")).toBeInTheDocument();
      expect(screen.queryByText("Book One")).not.toBeInTheDocument();
    });
  });

  it("should search books by section name", async () => {
    renderComponent();

    await waitFor(() => screen.getByText("Book One"));

    fireEvent.change(screen.getByLabelText("Search Section Name"), {
      target: { value: "Fiction" },
    });

    await waitFor(() => {
      expect(screen.getByText("Book One")).toBeInTheDocument();
      expect(screen.queryByText("Book Two")).not.toBeInTheDocument();
    });
  });

  it("should clear search criteria", async () => {
    renderComponent();

    await waitFor(() => screen.getByText("Book One"));

    fireEvent.change(screen.getByLabelText("Search Book Name"), {
      target: { value: "Book One" },
    });

    fireEvent.click(screen.getByLabelText("clear search Book Name"));

    await waitFor(() => {
      expect(screen.getByText("Book One")).toBeInTheDocument();
      expect(screen.getByText("Book Two")).toBeInTheDocument();
    });
  });

  it("should request a book", async () => {
    axios.post.mockResolvedValue({});

    renderComponent();

    await waitFor(() => screen.getByText("Book One"));

    fireEvent.click(screen.getAllByText("Request")[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Book requested successfully");
    });
  });
});
