const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all todos
router.get('/todos', async (req, res) => {
  const { userId } = req.query;
  const result = await db.query('SELECT * FROM todos WHERE user_id=$1', [userId]);
  res.json(result.rows);
});

// Add todo
router.post('/todos', async (req, res) => {
  const { userId, title } = req.body;
  const result = await db.query(
    'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
    [userId, title]
  );
  res.json(result.rows[0]);
});

// Update todo
router.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const result = await db.query(
    'UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *',
    [title, completed, id]
  );
  res.json(result.rows[0]);
});

// Delete todo
router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM todos WHERE id=$1', [id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
