import razorpayInstance from '../config/razorpay.js';
import { Order}  from '../models/orderModel.js';
import crypto from 'crypto';
import { Cart } from '../models/cartModel.js';

export const createOrder = async (req, res) => {
    try {
        const {products, amount, tax, shipping, currency} = req.body;
        const options = {
            amount : Math.round(Number(amount) * 100), // Amount in paise
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,

        }

        const razorpayOrder = await razorpayInstance.orders.create(options);

        // save order in db 
        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency: currency || 'INR',
            status: "Pending",
            razorpayOrderId: razorpayOrder.id,
        })

        await newOrder.save();
        res.status(201).json({success:true, message: 'Order created successfully', order: newOrder, razorpayOrder });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body;
        const userId = req.user._id;

        if(paymentFailed) {
            const order = await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "Failed" }, { new: true });
             return res.status(400).json({ message: "Payment verification failed" , order: order });
        }

       const sign = razorpay_order_id + "|" + razorpay_payment_id;
       const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest('hex');

        if(expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "Paid", razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature }, { new: true });
            await Cart.findOneAndUpdate({ user: req.user._id }, {$set: {items:[], totalPrice:0}});
            res.status(200).json({success:true, message: "Payment verified successfully", order: order });
        } else {
            await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "Failed" }, { new: true });
            res.status(400).json({ message: "Invalid payment signature" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}