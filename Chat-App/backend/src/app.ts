import express from 'express';
import AuthRouter from './routes/auth.routes';
import ChatRouter from './routes/chat.routes';
import MessagesRouter from './routes/message.routes';
import UserRouter from './routes/user.routes';
import { clerkMiddleware } from '@clerk/express'
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json()); // Parse incoming JSON requests bodies and makes them available as req.body in your route handlers.

// Middleware that integrates Clerk authentication into your Express application. It checks the request's cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the auth key.
app.use(clerkMiddleware())

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res
        .status(200)
        .json({
            message: 'Welcome to the Chat App API',
            version: '1.0.0',
    })
});

// Mounting the routers
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/chats', ChatRouter);
app.use('/api/v1/messages', MessagesRouter);
app.use('/api/v1/users', UserRouter);

// Error handlers must come after all the routes and other middleware so they can catch errors passed with next(err) or thrown inside async handler
app.use(errorHandler)

export default app;