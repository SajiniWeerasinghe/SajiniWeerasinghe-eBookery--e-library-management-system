import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import EbookManagement from '../components/EbookManagement';
import { AppContext } from '../context/AppContext';
import MockAdapter from 'axios-mock-adapter';
import { toast } from 'react-toastify';

// Mock axios and the toast
const mockAxios = new MockAdapter(axios);
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('EbookManagement Component', () => {
  const mockToken = 'mocked-token';
  const mockEbooks = [
    {
      _id: '1',
      name: 'Ebook 1',
      authors: ['Author 1'],
      section: { _id: 'section1', name: 'Section 1' },
    },
    {
      _id: '2',
      name: 'Ebook 2',
      authors: ['Author 2'],
      section: { _id: 'section2', name: 'Section 2' },
    },
  ];

  const mockSections = [
    { _id: 'section1', name: 'Section 1' },
    { _id: 'section2', name: 'Section 2' },
  ];

  beforeEach(() => {
    // Mock API calls
    mockAxios.onGet('http://localhost:5000/api/user/ebooks').reply(200, mockEbooks);
    mockAxios.onGet('http://localhost:5000/api/user/sections').reply(200, mockSections);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('deletes an ebook successfully', async () => {
    // Mock delete API response
    mockAxios.onDelete(`http://localhost:5000/api/librarian/ebooks/1`).reply(200);

    // Render the EbookManagement component
    render(
      <AppContext.Provider value={{ token: mockToken }}>
        <EbookManagement />
      </AppContext.Provider>
    );

    // Wait for e-books to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Ebook 1')).toBeInTheDocument();
      expect(screen.getByText('Ebook 2')).toBeInTheDocument();
    });

    // Click on the delete button for the first e-book
    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    // Confirm the deletion in the dialog
    await waitFor(() => {
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    });
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);

    // Wait for delete API call to complete
    await waitFor(() => {
      expect(mockAxios.history.delete.length).toBe(1);
      expect(mockAxios.history.delete[0].url).toBe(`http://localhost:5000/api/librarian/ebooks/1`);
    });

    // Verify that the toast and UI update correctly
    expect(toast.success).toHaveBeenCalledWith('E-book deleted successfully');
    await waitFor(() => {
      expect(screen.queryByText('Ebook 1')).not.toBeInTheDocument();
    });
  });
});
