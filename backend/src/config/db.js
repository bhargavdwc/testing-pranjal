import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import dns from 'dns';

// Configure public DNS servers (Google 8.8.8.8 & Cloudflare 1.1.1.1)
// to resolve MongoDB Atlas SRV records reliably across Windows and ISP networks
if (process.env.DISABLE_CUSTOM_DNS !== 'true') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    logger.info('Public DNS servers (8.8.8.8, 1.1.1.1) configured for MongoDB Atlas');
  } catch (e) {
    logger.warn('Could not set custom DNS servers:', e.message);
  }
}

const connectDB = async (retries = 5, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME || 'test',
      });
      logger.info(`MongoDB Connected: ${conn.connection.host}, database: ${conn.connection.db.databaseName}`);
      return conn;
    } catch (error) {
      logger.error(`MongoDB Connection Error (Attempt ${attempt}/${retries}): ${error.message}`);
      if (attempt < retries) {
        logger.info(`Retrying MongoDB connection in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 1.5;
      } else {
        logger.error('All MongoDB connection attempts failed. Exiting process.');
        process.exit(1);
      }
    }
  }
};

export default connectDB;
