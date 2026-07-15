import express from 'express';
import { createOrder, verifyPayment } from '../controllers/orderController.js';
import {isauthenticated} from '../middleware/isAuthonticated.js';

const router = express.Router();

router.post('/create-order', isauthenticated, createOrder);
router.post('/verify-payment', isauthenticated, verifyPayment);

export default router;