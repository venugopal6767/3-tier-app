const express = require('express');
const db = require('../db');
const metrics = require('../metrics');
const router = express.Router();

// For simplicity, user_id is passed in requests. In production use sessions or JWT.

// list todos for user
router.get('/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  db.query('SELECT * FROM todos WHERE user_id=$1 ORDER BY id DESC', [userId], (err, result) => {
    if (err) {
      console.error('List todos error', err);
      return res.status(500).json({ error: 'Could not list todos' });
    }
    res.json({ todos: result.rows });
  });
});

// create
router.post('/', (req, res) => {
  const { user_id, title } = req.body;
  if (!user_id || !title) return res.status(400).json({ error: 'user_id and title required' });
  db.query('INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *', [user_id, title], (err, result) => {
    if (err) {
      console.error('Create todo error', err);
      return res.status(500).json({ error: 'Could not create todo' });
    }
    metrics.todoCreated.inc();
    res.json({ todo: result.rows[0] });
  });
});

// update
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, completed } = req.body;
  db.query('UPDATE todos SET title=$1, completed=$2, updated_at=now() WHERE id=$3 RETURNING *', [title, completed, id], (err, result) => {
    if (err) {
      console.error('Update todo error', err);
      return res.status(500).json({ error: 'Could not update todo' });
    }
    metrics.todoUpdated.inc();
    res.json({ todo: result.rows[0] });
  });
});

// delete
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.query('DELETE FROM todos WHERE id=$1 RETURNING *', [id], (err, result) => {
    if (err) {
      console.error('Delete todo error', err);
      return res.status(500).json({ error: 'Could not delete todo' });
    }
    metrics.todoDeleted.inc();
    res.json({ deleted: result.rows[0] });
  });
});

module.exports = router;
