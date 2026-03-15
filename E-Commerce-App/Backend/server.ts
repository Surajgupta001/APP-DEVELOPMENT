import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/database.js";
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { clerkWebhook, syncCurrentUser } from "./controllers/webhooks.js";

const app = express();

app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.post('/api/users/sync', requireAuth(), syncCurrentUser);

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();