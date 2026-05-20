import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import authRouter from './routes/auth.js';
import { rateLimit } from './middleware/rate-limit.js';
import { requireAuth } from './middleware/auth.js';

const app = express();

app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',') }));
app.use(express.json({ limit: '64kb' }));
app.use(rateLimit);

app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now(), eskizLive: config.eskiz.live });
});

app.use('/auth', authRouter);

app.get('/me', requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

app.use((_req, res) => {
  res.status(404).json({ code: 'NOT_FOUND', message: 'Route not found' });
});

app.listen(config.port, () => {
  console.log(`UzCard Bank backend listening on :${config.port}`);
  console.log(`Eskiz mode: ${config.eskiz.live ? 'LIVE (real SMS)' : 'DEV (codes logged to console)'}`);
});
