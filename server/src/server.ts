import app from './app';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db';

dotenv.config();
const PORT = process.env.PORT || 5000;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});
