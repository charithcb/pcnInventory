import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './infrastructure/database/config/db';

dotenv.config();

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const createServer = (port: number): void => {
    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
            const nextPort = port + 1;
            console.warn(`Port ${port} is in use, trying port ${nextPort}...`);
            server.close(() => createServer(nextPort));
            return;
        }

        console.error('Failed to start server:', error);
        process.exit(1);
    });
};

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        createServer(DEFAULT_PORT);
    } catch (error) {
        console.error('Failed to initialize application:', error);
        process.exit(1);
    }
};

startServer();
