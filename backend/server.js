import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import memberRoutes from './src/routes/memberRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorHandler.js';

const app = express();

app.use(cors()); // open CORS: no client URL needed in .env
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/members', memberRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`API running on port ${PORT}`)));
