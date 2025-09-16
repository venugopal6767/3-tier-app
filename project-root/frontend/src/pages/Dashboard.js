import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', scheduled_time: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
        setTasks(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load tasks');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchTasks();
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.scheduled_time) {
      setError('Title and scheduled time are required');
      return;
    }
    try {
      await axios.post(`${API_URL}/tasks`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Task created successfully!');
      setError('');
      setFormData({ title: '', description: '', scheduled_time: '' });
      const res = await axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task');
      setSuccess('');
    }
  };

  const handleUpdate = async (taskId, updatedData) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, updatedData, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Task updated successfully!');
      setError('');
      const res = await axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update task');
      setSuccess('');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Task deleted successfully!');
      setError('');
      const res = await axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete task');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="mb-8">
          <h3 className="text-xl mb-4 text-gray-700">Add New Task</h3>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="description"
            placeholder="Task Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="datetime-local"
            name="scheduled_time"
            value={formData.scheduled_time}
            onChange={handleChange}
            className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600">
            Add Task
          </button>
        </form>
        <h3 className="text-xl mb-4 text-gray-700">Your Tasks</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-4 p-4 border rounded bg-gray-50">
              <h4 className="font-semibold">{task.title}</h4>
              <p>{task.description}</p>
              <p>Scheduled: {new Date(task.scheduled_time).toLocaleString()}</p>
              <p>Status: {task.status}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() =>
                    handleUpdate(task.id, {
                      ...task,
                      status: task.status === 'pending' ? 'completed' : 'pending',
                    })
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Toggle Status
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
          className="bg-red-500 text-white w-full py-2 rounded hover:bg-red-600 mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;