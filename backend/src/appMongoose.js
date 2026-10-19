require('dotenv').config();
const mongoose = require('mongoose');

const cached = global.__helpdeskMongo || { connection: null, promise: null };
global.__helpdeskMongo = cached;

async function connectDb() {
    if (cached.connection && mongoose.connection.readyState === 1) {
        return cached.connection;
    }

    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;
    if (!mongoUrl) {
        throw new Error('MONGO_URL or MONGODB_URI is not configured');
    }

    if (!cached.promise) {
        const databaseUrl = process.env.DB_NAME
            ? `${mongoUrl.replace(/\/$/, '')}/${process.env.DB_NAME}`
            : mongoUrl;
        cached.promise = mongoose.connect(databaseUrl, { serverSelectionTimeoutMS: 10000 });
    }

    cached.connection = await cached.promise;
    return cached.connection;
}

module.exports = connectDb;
