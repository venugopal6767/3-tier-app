const API_BASE = process.env.REACT_APP_API_URL || 'http://backend:5000';

export const registerUser = async (username, password) => {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

export const loginUser = async (username, password) => {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
};

export const getTodos = async (userId) => {
  const res = await fetch(`${API_BASE}/api/todos?userId=${userId}`);
  return res.json();
};

export const addTodo = async (userId, title) => {
  const res = await fetch(`${API_BASE}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, title }),
  });
  return res.json();
};
