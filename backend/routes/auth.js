const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const metrics = require('../metrics');

// Registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    res.json({ user: result.rows[0], message: `Welcome, ${result.rows[0].username}!` });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'User registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  try {
    const result = await db.query('SELECT id, username, password FROM users WHERE username=$1', [username]);
    if (result.rows.length === 0) {
      metrics.loginFailure.inc();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      metrics.loginFailure.inc();
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    metrics.loginSuccess.inc();
    res.json({ user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error', err);
    metrics.loginFailure.inc();
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
