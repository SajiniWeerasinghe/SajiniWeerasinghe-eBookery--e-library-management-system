import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AvailableBooks from "../AvailableBooks"; // Adjust the path accordingly
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

const mockBooks = [
  {
    _id: "1",
    name: "React for Beginners",
    authors: ["John Doe"],
    section: { name: "Programming" },
  },
  {
    _id: "2",
    name: "Advanced Node.js",
    authors: ["Jane Smith"],
    section: { name: "Programming" },
  },
  {
    _id: "3",
    name: "Cooking 101",
    authors: ["Alice Johnson"],
    section: { name: "Culinary" },
  },
];

describe("AvailableBooks Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockBooks });
  });

  it("should render books and filter by book name, author name, section name, and clear search criteria", async () => {
    // Render the component within the AppContext provider
    const mockToken = "mockToken123";
    render(
      <AppContext.Provider value={{ token: mockToken }}>
        <AvailableBooks />
      </AppContext.Provider>
    );

    // Wait for books to load
    expect(await screen.findByText("React for Beginners")).toBeInTheDocument();
    expect(screen.getByText("Advanced Node.js")).toBeInTheDocument();
    expect(screen.getByText("Cooking 101")).toBeInTheDocument();

    // Search by book name
    fireEvent.change(screen.getByLabelText("Search Book Name"), {
      target: { value: "React" },
    });
    expect(await screen.findByText("React for Beginners")).toBeInTheDocument();
    expect(screen.queryByText("Advanced Node.js")).not.toBeInTheDocument();
    expect(screen.queryByText("Cooking 101")).not.toBeInTheDocument();

    // Clear book name search
    fireEvent.click(screen.getByLabelText("clear bookName search"));
    expect(await screen.findByText("React for Beginners")).toBeInTheDocument();
    expect(screen.getByText("Advanced Node.js")).toBeInTheDocument();
    expect(screen.getByText("Cooking 101")).toBeInTheDocument();

    // Search by author name
    fireEvent.change(screen.getByLabelText("Search Author Name"), {
      target: { value: "Jane" },
    });
    expect(await screen.findByText("Advanced Node.js")).toBeInTheDocument();
    expect(screen.queryByText("React for Beginners")).not.toBeInTheDocument();
    expect(screen.queryByText("Cooking 101")).not.toBeInTheDocument();

    // Clear author name search
    fireEvent.click(screen.getByLabelText("clear authorName search"));
    expect(await screen.findByText("React for Beginners")).toBeInTheDocument();
    expect(screen.getByText("Advanced Node.js")).toBeInTheDocument();
    expect(screen.getByText("Cooking 101")).toBeInTheDocument();

    // Search by section name
    fireEvent.change(screen.getByLabelText("Search Section Name"), {
      target: { value: "Culinary" },
    });
    expect(await screen.findByText("Cooking 101")).toBeInTheDocument();
    expect(screen.queryByText("React for Beginners")).not.toBeInTheDocument();
    expect(screen.queryByText("Advanced Node.js")).not.toBeInTheDocument();

    // Clear section name search
    fireEvent.click(screen.getByLabelText("clear sectionName search"));
    expect(await screen.findByText("React for Beginners")).toBeInTheDocument();
    expect(screen.getByText("Advanced Node.js")).toBeInTheDocument();
    expect(screen.getByText("Cooking 101")).toBeInTheDocument();
  });
});
