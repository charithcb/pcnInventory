import http from 'http';
import app from './app';

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const startServer = (port: number): void => {
    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
            const nextPort = port + 1;
            console.warn(`Port ${port} is in use, trying port ${nextPort}...`);
            server.close(() => startServer(nextPort));
            return;
        }

        console.error('Failed to start server:', error);
        process.exit(1);
    });
};

startServer(DEFAULT_PORT);


