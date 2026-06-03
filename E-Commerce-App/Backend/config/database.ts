import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error('MONGODB_URI is missing in environment variables');
    }

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        family: 4,
    });
};

export default connectDB;