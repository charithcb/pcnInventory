import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined in the environment.');
    }

    try {
        await mongoose.connect(mongoUri);
        const { host, name } = mongoose.connection;
        console.log(`MongoDB Connected Successfully to ${host}/${name}`);
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        throw error;
    }
};
