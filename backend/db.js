const { Pool } = require('pg');
const metrics = require('./metrics');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'appdb',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

// query wrapper that logs queries and increments metric
function query(text, params, cb) {
  const start = Date.now();
  metrics.dbQueries.inc();
  return pool.query(text, params, (err, res) => {
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res ? res.rowCount : 0 });
    if (cb) cb(err, res);
  });
}

module.exports = {
  query,
  pool
};
