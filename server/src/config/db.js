import mongoose from 'mongoose';
import dns from 'node:dns'
import 'dotenv/config';
dns.setServers(["8.8.8.8", "8.8.4.4"]);
mongoose.set('strictQuery', 'throw');

let isConnected = false;

const DBconnect = async (retries = 5) => {
  if (isConnected) return;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        autoIndex: process.env.NODE_ENV !== 'production',
      });

      isConnected = true;
       console.log('MongoDB connected');
      return;
    } catch (error) {
      console.error(`DB connect failed (${attempt}/${retries}):`, error.message);

      if (attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));

export const disconnectDB = async () => {
  await mongoose.connection.close();
  isConnected = false;
};

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

export default DBconnect;