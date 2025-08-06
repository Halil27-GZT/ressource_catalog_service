import express from 'express';
import resourcesRouter from './routes/resources.js';
import { errorHandler } from './middleware/error-handler.js';

const port = 5002;

const app = express();

// Middleware (pre-routing)
app.use(express.json());

// Routes
app.use('/resources', resourcesRouter);

// globale Fehlerbehandlung Middleware (post-routing)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});