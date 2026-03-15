import "dotenv/config";
import express, { Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/database.js";
import { clerkMiddleware, requireAuth } from '@clerk/express';
import { clerkWebhook, syncCurrentUser } from "./controllers/webhooks.js";
import makeAdmin from "./scripts/makeAdmin.js";
import ProductRouter from "./routes/product.routes.js";
import CartRouter from "./routes/cart.routes.js";
import OrderRouter from "./routes/order.routes.js";
import AddressRouter from "./routes/address.routes.js";
import AdminRouter from "./routes/admin.routes.js";

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

// Routes
app.use('/api/products', ProductRouter);
app.use('/api/cart', CartRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/addresses', AddressRouter);
app.use('/api/admin', AdminRouter);

const startServer = async () => {
    try {
        await connectDB();
        await makeAdmin();

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();