import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { router as reportRouter } from './routes/report.js';
import { router as mockSfRouter } from './routes/mockSalesforce.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

// Serve UI
app.use(express.static(path.join(__dirname, '..', 'public')));

// Mock Salesforce endpoints (no auth — development only)
app.use('/mock/sf', mockSfRouter);

// Report API (authenticated)
app.use('/api/reports', reportRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// Central error handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`pediatric-report listening on :${PORT}`));
}

export default app;
