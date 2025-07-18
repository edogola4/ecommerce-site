import mongoose from 'mongoose';
import { createClient } from 'redis';

class Database {
  private static instance: Database;
  private redisClient: any;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connectMongoDB(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
      
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0,
      });

      console.log('✅ MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB disconnected');
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
      });

    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      process.exit(1);
    }
  }

  public async connectRedis(): Promise<void> {
    try {
      this.redisClient = createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
        password: process.env.REDIS_PASSWORD || undefined,
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
      });

      this.redisClient.on('error', (err: any) => {
        console.error('❌ Redis connection error:', err);
      });

      this.redisClient.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      this.redisClient.on('ready', () => {
        console.log('✅ Redis ready to use');
      });

      this.redisClient.on('end', () => {
        console.log('⚠️  Redis connection ended');
      });

      await this.redisClient.connect();

    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      // Don't exit process for Redis failures as it's not critical
    }
  }

  public getRedisClient() {
    return this.redisClient;
  }

  public async disconnectAll(): Promise<void> {
    try {
      await mongoose.connection.close();
      if (this.redisClient) {
        await this.redisClient.quit();
      }
      console.log('✅ All database connections closed');
    } catch (error) {
      console.error('❌ Error closing database connections:', error);
    }
  }
}

export default Database;