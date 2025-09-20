export const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204, // For legacy browsers like IE11
  maxAge: 86400, // Cache preflight response for 1 day (in seconds)
};
