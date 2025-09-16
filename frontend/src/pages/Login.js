import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    if (!username || !password) return setMessage('Please provide username and password');
    const res = await login(username, password);
    if (res.error) return setMessage(res.error);
    if (res.user) {
      navigate(`/todos/${res.user.id}`);
    } else {
      setMessage('Login failed');
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
        </div>
        <div className="form-row">
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        </div>
        <div className="form-row">
          <button type="submit">Login</button>
        </div>
      </form>
      {message && <div className="small">{message}</div>}
    </div>
  );
}
