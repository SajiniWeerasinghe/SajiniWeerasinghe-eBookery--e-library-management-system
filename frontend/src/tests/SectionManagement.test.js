import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "react-toastify";
import SectionManagement from "./SectionManagement.test";
import { AppContext } from "../context/AppContext";

jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockSections = [
  { _id: "1", name: "Section 1", description: "Description 1", dateCreated: new Date() },
];

const renderWithContext = (token) => {
  return render(
    <AppContext.Provider value={{ token }}>
      <SectionManagement />
    </AppContext.Provider>
  );
};

// UT_15 - Verify that a new section can be added with valid details
test("Adds a new section with valid details", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });
  axios.post.mockResolvedValueOnce({ data: { _id: "2", name: "New Section", description: "New Desc" } });

  renderWithContext("valid-token");

  fireEvent.change(screen.getByLabelText(/Section Name/i), { target: { value: "New Section" } });
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "New Desc" } });

  fireEvent.click(screen.getByText(/Add Section/i));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/librarian/sections",
      { name: "New Section", description: "New Desc" },
      { headers: { Authorization: `Bearer valid-token` } }
    );
    expect(screen.getByText(/New Section/i)).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Section added successfully");
  });
});

// UT_16 - Test that a section cannot be added with empty fields
test("Does not add section with empty fields", async () => {
  renderWithContext("valid-token");

  fireEvent.click(screen.getByText(/Add Section/i));

  await waitFor(() => {
    expect(axios.post).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Error adding Section");
  });
});

// UT_17 - Verify that section form fields reset after adding a section
test("Resets form fields after adding section", async () => {
  axios.post.mockResolvedValueOnce({ data: { _id: "2", name: "New Section", description: "New Desc" } });

  renderWithContext("valid-token");

  const sectionNameInput = screen.getByLabelText(/Section Name/i);
  const descriptionInput = screen.getByLabelText(/Description/i);

  fireEvent.change(sectionNameInput, { target: { value: "New Section" } });
  fireEvent.change(descriptionInput, { target: { value: "New Desc" } });

  fireEvent.click(screen.getByText(/Add Section/i));

  await waitFor(() => {
    expect(sectionNameInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
  });
});

// UT_18 - Verify that the user can edit a section
test("Edits a section successfully", async () => {
  axios.get.mockResolvedValueOnce({ data: mockSections });
  axios.put.mockResolvedValueOnce({ data: { _id: "1", name: "Edited Section", description: "Edited Desc" } });

  renderWithContext("valid-token");

  await waitFor(() => screen.getByText(/Section 1/i));

  fireEvent.click(screen.getByTestId("EditIcon"));

  fireEvent.change(screen.getByLabelText(/Section Name/i), { target: { value: "Edited Section" } });
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "Edited Desc" } });

  fireEvent.click(screen.getByText(/Update Section/i));

  await waitFor(() => {
    expect(screen.getByText(/Edited Section/i)).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Section updated successfully");
  });
});

// UT_19 - Verify that a section can be deleted
test("Deletes a section successfully", async () => {
  axios.get.mockResolvedValueOnce({ data: mockSections });
  axios.delete.mockResolvedValueOnce({});

  renderWithContext("valid-token");

  await waitFor(() => screen.getByText(/Section 1/i));

  fireEvent.click(screen.getByTestId("DeleteIcon"));
  fireEvent.click(screen.getByText(/Delete/i));

  await waitFor(() => {
    expect(screen.queryByText(/Section 1/i)).not.toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Section deleted successfully");
  });
});

// UT_20 - Verify that a user can cancel the deletion of a section
test("Cancels section deletion", async () => {
  axios.get.mockResolvedValueOnce({ data: mockSections });

  renderWithContext("valid-token");

  await waitFor(() => screen.getByText(/Section 1/i));

  fireEvent.click(screen.getByTestId("DeleteIcon"));
  fireEvent.click(screen.getByText(/Cancel/i));

  await waitFor(() => {
    expect(screen.getByText(/Section 1/i)).toBeInTheDocument();
  });
});

// UT_21 - Check that the correct message is shown when no sections are available
test("Shows 'No sections available' message", async () => {
  axios.get.mockResolvedValueOnce({ data: [] });

  renderWithContext("valid-token");

  await waitFor(() => {
    expect(screen.getByText(/No sections available/i)).toBeInTheDocument();
  });
});
