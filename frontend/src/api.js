// Use relative paths so the frontend can call the backend via the same origin (nginx will proxy /api -> backend)
const API_BASE = (process.env.REACT_APP_API_URL !== undefined) ? process.env.REACT_APP_API_URL : '';

export async function register(username, password) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function listTodos(userId) {
  const res = await fetch(`${API_BASE}/api/todos/${userId}`);
  return res.json();
}

export async function createTodo(userId, title) {
  const res = await fetch(`${API_BASE}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, title })
  });
  return res.json();
}

export async function updateTodo(id, title, completed) {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed })
  });
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_BASE}/api/todos/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}
