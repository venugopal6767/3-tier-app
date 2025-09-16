const express = require('express');
const db = require('../db');
const router = express.Router();

// register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  db.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username', [username, password], (err, result) => {
    if (err) {
      console.error('Register error', err);
      return res.status(500).json({ error: 'User registration failed' });
    }
    res.json({ user: result.rows[0], message: `Welcome, ${result.rows[0].username}!` });
  });
});

// login (very basic; for demo only)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  db.query('SELECT id, username FROM users WHERE username=$1 AND password=$2', [username, password], (err, result) => {
    if (err) {
      console.error('Login error', err);
      return res.status(500).json({ error: 'Login failed' });
    }
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user: result.rows[0] });
  });
});

module.exports = router;
