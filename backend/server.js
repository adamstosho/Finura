import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { readFileSync } from 'fs';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = JSON.parse(readFileSync(new URL('./swagger.json', import.meta.url)));

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors({
  origin: ['http://localhost:3004', 'https://finuura.vercel.app', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003'],
  credentials: true,
}));
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/expenses', expenseRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
}); 