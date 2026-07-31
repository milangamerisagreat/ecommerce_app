import express from 'express';
import { createOrder, getAllOrdersAdmin, getMyOrder, getSalesData, getUserOrders, verifyPayment } from '../controllers/orderController.js';
import {isAdmin, isauthenticated} from '../middleware/isAuthonticated.js';

const router = express.Router();

router.post('/create-order', isauthenticated, createOrder);
router.post('/verify-payment', isauthenticated, verifyPayment);
router.get('/myorder', isauthenticated, getMyOrder);
router.get('/all', isauthenticated, isAdmin, getAllOrdersAdmin);
router.get('/user-order/:userId', isauthenticated, isAdmin, getUserOrders);
router.get('/sales', isauthenticated, isAdmin, getSalesData);


export default router;