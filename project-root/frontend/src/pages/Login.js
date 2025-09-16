import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getCsrfToken = async () => {
    try {
      const res = await axios.get(`${API_URL}/csrf-token`);
      return res.data.csrf_token;
    } catch (err) {
      console.error('Failed to fetch CSRF token', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        setError('Could not get CSRF token');
        return;
      }

      const res = await axios.post(`${API_URL}/users/login`, formData, {
        headers: { 'X-CSRF-Token': csrfToken },
      });

      localStorage.setItem('token', res.data.access_token);
      setSuccess('Login successful! Redirecting to dashboard...');
      setError('');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
