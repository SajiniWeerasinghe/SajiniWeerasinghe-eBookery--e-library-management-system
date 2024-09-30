import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import RequestManagement from '../RequestManagement'; // Update this path as necessary
import { AppContext } from '../context/AppContext';

// Mock axios and toast
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock token context
const mockToken = 'mockToken';
const mockContextValue = {
  token: mockToken,
};

const mockRequests = [
  {
    _id: '1',
    ebook: { _id: 'book1', name: 'Test Book 1' },
    username: 'reader1',
    status: 'pending',
  },
  {
    _id: '2',
    ebook: { _id: 'book2', name: 'Test Book 2' },
    username: 'reader2',
    status: 'granted',
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
  },
];

describe('RequestManagement Integration Tests', () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockRequests });
  });

  test('Verify that a reader is requesting a book and that the request is successfully displayed to the admin', async () => {
    render(
      <AppContext.Provider value={mockContextValue}>
        <RequestManagement />
      </AppContext.Provider>
    );

    // Wait for the pending requests to appear
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Check if the admin can see the pending request
    expect(screen.getByText('Pending Requests')).toBeInTheDocument();
    expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    expect(screen.getByText('reader1')).toBeInTheDocument();
  });

  test('Verify that the admin successfully grants permission for the e-book and that it is displayed correctly to the reader', async () => {
    axios.put.mockResolvedValueOnce({}); // Mock axios.put success response

    render(
      <AppContext.Provider value={mockContextValue}>
        <RequestManagement />
      </AppContext.Provider>
    );

    // Wait for pending requests
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
    });

    // Admin grants permission
    const grantButton = screen.getByText('Grant');
    fireEvent.click(grantButton);

    // Wait for toast message and data to update
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Request granted successfully');
    });

    // Check that the request is no longer pending and moved to granted
    expect(axios.put).toHaveBeenCalledWith(
      'http://localhost:5000/api/librarian/requests/1',
      { status: 'granted' },
      { headers: { Authorization: `Bearer ${mockToken}` } }
    );
  });

  test('Verify that a reader successfully returns an e-book and that the returned e-book is displayed correctly to the reader', async () => {
    axios.post.mockResolvedValueOnce({}); // Mock axios.post success response

    render(
      <AppContext.Provider value={mockContextValue}>
        <RequestManagement />
      </AppContext.Provider>
    );

    // Wait for granted requests
    await waitFor(() => {
      expect(screen.getByText('Granted Books')).toBeInTheDocument();
      expect(screen.getByText('Test Book 2')).toBeInTheDocument();
    });

    // Admin revokes the book (simulating return)
    const revokeButton = screen.getByText('Revoke');
    fireEvent.click(revokeButton);

    // Wait for toast message and data to update
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('E-book revoked successfully');
    });

    // Check that the revoke API was called
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/librarian/ebooks/book2/revoke',
      {},
      { headers: { Authorization: `Bearer ${mockToken}` } }
    );
  });
});
