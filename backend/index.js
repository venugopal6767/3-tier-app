const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const todosRoutes = require('./routes/todos');
const metrics = require('./metrics');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

// metrics middleware - register early so that all routes are measured
app.use(metrics.metricsMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/todos', todosRoutes);

// metrics endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', metrics.client.register.contentType);
    res.end(await metrics.client.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// simple health
app.get('/', (req, res) => res.send('Frontend served separately. Frontend URL: /'));

// error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  // Optionally log DB version
  db.query('SELECT version()', [], (err, result) => {
    if (err) console.error('DB version check failed', err);
    else console.log('DB version:', result.rows[0].version);
  });
});
