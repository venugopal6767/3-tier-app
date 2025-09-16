import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    if (!username || !password) return setMessage('Please provide username and password');
    const res = await register(username, password);
    if (res.error) return setMessage(res.error);
    setMessage(res.message || 'Registered!');
    // show welcome and redirect to login
    setTimeout(()=> navigate('/login'), 1500);
  }

  return (
    <div className="card">
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
        </div>
        <div className="form-row">
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        </div>
        <div className="form-row">
          <button type="submit">Register</button>
        </div>
      </form>
      {message && <div className="small">{message}</div>}
    </div>
  );
}
