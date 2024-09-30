import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RequestManagement from "./RequestManagement";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

// Mock the dependencies
jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("RequestManagement Component", () => {
  const mockToken = "mocked_token";

  const renderComponent = () => {
    return render(
      <AppContext.Provider value={{ token: mockToken }}>
        <RequestManagement />
      </AppContext.Provider>
    );
  };

  const pendingRequests = [
    {
      _id: "1",
      ebook: { name: "E-book 1" },
      username: "User1",
      status: "pending",
    },
  ];

  const grantedRequests = [
    {
      _id: "2",
      ebook: { name: "E-book 2" },
      username: "User2",
      status: "granted",
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ];

  beforeEach(() => {
    // Mock the axios.get API call to return pending and granted requests
    axios.get.mockResolvedValue({
      data: [...pendingRequests, ...grantedRequests],
    });
  });

  it("should grant a pending request successfully", async () => {
    // Render the component
    renderComponent();

    // Wait for the requests to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("Pending Requests")).toBeInTheDocument();
    });

    // Click the "Grant" button for the first pending request
    const grantButton = screen.getByText("Grant");
    fireEvent.click(grantButton);

    // Mock the PUT request for granting the request
    axios.put.mockResolvedValueOnce({});

    // Wait for the request to be updated
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Request granted successfully");
    });
  });

  it("should reject a pending request", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Pending Requests")).toBeInTheDocument();
    });

    // Click the "Reject" button for the pending request
    const rejectButton = screen.getByText("Reject");
    fireEvent.click(rejectButton);

    axios.put.mockResolvedValueOnce({});

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Request rejected successfully");
    });
  });

  it("should revoke a granted request successfully", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Granted Books")).toBeInTheDocument();
    });

    // Click the "Revoke" button for the granted request
    const revokeButton = screen.getByText("Revoke");
    fireEvent.click(revokeButton);

    axios.post.mockResolvedValueOnce({});

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("E-book revoked successfully");
    });
  });

  it("should display a message when no granted requests exist", async () => {
    // Mock an empty granted requests response
    axios.get.mockResolvedValueOnce({
      data: pendingRequests, // No granted requests
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.queryByText("Granted Books")).not.toBeInTheDocument();
      expect(screen.getByText("No active granted requests.")).toBeInTheDocument();
    });
  });
});
