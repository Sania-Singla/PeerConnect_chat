import './config/envLoader.js';
import { app } from './app.js';
import { createServer } from 'http';
import { connectRedis } from './db/connectRedis.js';
import { dbInstance } from './db/connectDB.js';

const httpServer = createServer(app);

const PORT = process.env.PORT || 4000;

// Connect to Redis
const redisClient = await connectRedis();

// Connect to main DB
const connection = await dbInstance.connect();

httpServer.listen(PORT, () =>
    console.log(`server is listening on port ${PORT}...`)
);

export { redisClient, connection, httpServer };
