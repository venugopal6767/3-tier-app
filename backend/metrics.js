const client = require('prom-client');

// collect default metrics like process_cpu_user_seconds_total, etc.
client.collectDefaultMetrics({ timeout: 5000 });

// create metrics
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

const loginSuccess = new client.Counter({
  name: 'login_success_total',
  help: 'Number of successful logins'
});
const loginFailure = new client.Counter({
  name: 'login_failure_total',
  help: 'Number of failed logins'
});

const todoCreated = new client.Counter({
  name: 'todo_created_total',
  help: 'Number of todos created'
});
const todoUpdated = new client.Counter({
  name: 'todo_updated_total',
  help: 'Number of todos updated'
});
const todoDeleted = new client.Counter({
  name: 'todo_deleted_total',
  help: 'Number of todos deleted'
});

const dbQueries = new client.Counter({
  name: 'db_queries_total',
  help: 'Number of database queries executed'
});

// middleware to instrument requests
function metricsMiddleware(req, res, next) {
  const end = httpRequestDuration.startTimer();
  const route = req.route && req.route.path ? req.route.path : req.path;

  res.on('finish', () => {
    const labels = { method: req.method, route, status_code: res.statusCode };
    httpRequestCounter.inc(labels);
    end({ method: req.method, route, status_code: res.statusCode });
  });
  next();
}

module.exports = {
  client,
  metricsMiddleware,
  httpRequestCounter,
  httpRequestDuration,
  loginSuccess,
  loginFailure,
  todoCreated,
  todoUpdated,
  todoDeleted,
  dbQueries
};
