const client = require('prom-client');

const loginSuccess = new client.Counter({ name: 'login_success_total', help: 'Successful logins' });
const loginFailure = new client.Counter({ name: 'login_failure_total', help: 'Failed logins' });

const router = require('express').Router();
router.get('/', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = { loginSuccess, loginFailure, router };
