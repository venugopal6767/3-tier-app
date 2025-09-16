const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');
const metrics = require('./metrics');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Mount routers
app.use('/api', authRouter);
app.use('/api', todosRouter);

// Metrics endpoint
app.use('/metrics', metrics.router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
