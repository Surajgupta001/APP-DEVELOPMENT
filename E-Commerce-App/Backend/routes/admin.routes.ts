import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import { getDashboardStats } from '../controllers/admin.controllers.js';

const AdminRouter = express.Router();

// Get Dashboard Stats
AdminRouter.get('/stats', protect, authorize('admin'), getDashboardStats);

export default AdminRouter;