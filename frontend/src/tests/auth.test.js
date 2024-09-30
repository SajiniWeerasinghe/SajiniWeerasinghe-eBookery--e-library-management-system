import axios from 'axios';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../components/Register';
import Login from '../components/Login';
import { BrowserRouter as Router } from 'react-router-dom'; // For handling routing in tests
import { AppContext } from '../context/AppContext';

// Mock axios
jest.mock('axios');

const mockDispatch = jest.fn();

const renderWithContext = (ui, { contextValue }) => {
  return render(
    <Router>
      <AppContext.Provider value={contextValue}>{ui}</AppContext.Provider>
    </Router>
  );
};

describe('Integration Test - User Registration and Login', () => {
  it('should register a new user and store the details in the database', async () => {
    axios.post.mockResolvedValue({
      data: { token: 'mockToken', user: { username: 'testuser' } },
    });

    renderWithContext(<Register />, { contextValue: { dispatch: mockDispatch } });

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText(/Register/i));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/register', {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOGIN_SUCCESS',
      payload: { token: 'mockToken', role: 'user' },
    });
  });

  it('should allow registered users to log in and redirect to the dashboard', async () => {
    axios.post.mockResolvedValue({
      data: { token: 'mockToken', user: { role: 'user' } },
    });

    renderWithContext(<Login />, { contextValue: { dispatch: mockDispatch } });

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText(/Login/i));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/login', {
      username: 'testuser',
      password: 'password123',
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOGIN_SUCCESS',
      payload: { token: 'mockToken', role: 'user' },
    });
  });

  it('should show an error message when wrong password is provided', async () => {
    axios.post.mockRejectedValue({
      response: { data: { msg: 'Invalid password' } },
    });

    renderWithContext(<Login />, { contextValue: { dispatch: mockDispatch } });

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });

    fireEvent.click(screen.getByText(/Login/i));

    const errorMessage = await screen.findByText(/Invalid password/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show an error message when wrong username is provided', async () => {
    axios.post.mockRejectedValue({
      response: { data: { msg: 'Username not found' } },
    });

    renderWithContext(<Login />, { contextValue: { dispatch: mockDispatch } });

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByText(/Login/i));

    const errorMessage = await screen.findByText(/Username not found/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
