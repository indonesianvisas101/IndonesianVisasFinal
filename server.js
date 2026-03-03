// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    // Attach Socket.io
    const io = new Server(server, {
        cors: { origin: "*" },
        path: "/ws/ai-status",
    });

    // Basic connection handler
    io.on('connection', (socket) => {
        console.log(`[AI SOCKET] Admin Dashboard Connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`[AI SOCKET] Admin Dashboard Disconnected: ${socket.id}`);
        });
    });

    // Store the io instance globally so Next.js API routes can emit events
    global.io = io;

    server.once('error', (err) => {
        console.error(err);
        process.exit(1);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
        console.log(`> AI WebSocket Server Active on /ws/ai-status`);
    });
});
