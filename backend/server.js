require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const path       = require('path');
const connectDB  = require('../config/db.config');
const corsOpts   = require('../config/cors.config');
const errorMiddleware = require('./middleware/error.middleware');

// ─── Route imports ────────────────────────────
const authRoutes      = require('./routes/auth.routes');
const userRoutes      = require('./routes/user.routes');
const foodRoutes      = require('./routes/food.routes');
const pointsRoutes    = require('./routes/points.routes');
const marathonRoutes  = require('./routes/marathon.routes');
const communityRoutes = require('./routes/community.routes');
const reportRoutes    = require('./routes/report.routes');

// ─── DB ───────────────────────────────────────
connectDB();

const app = express();

// ─── Global Middleware ────────────────────────
app.use(cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ─── API Routes ───────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/food',      foodRoutes);
app.use('/api/points',    pointsRoutes);
app.use('/api/marathon',  marathonRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/report',    reportRoutes);

// ─── Health check ─────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Serve Frontend (production) ──────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// ─── Error Handler (must be last) ────────────
app.use(errorMiddleware);

// ─── Start ────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sugar Streaker server running on port ${PORT} [${process.env.NODE_ENV}]`);
});

module.exports = app; // for testing
