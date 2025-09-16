import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Todos from './pages/Todos';

function App() {
  return (
    <div className="app">
      <nav className="nav">
        <h1 className="logo">ColorTodo</h1>
        <div>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<div style={{padding:20}}>Welcome to ColorTodo — colorful todos!</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/todos/:userId" element={<Todos />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
