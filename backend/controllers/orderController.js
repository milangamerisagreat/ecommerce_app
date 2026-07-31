import razorpayInstance from '../config/razorpay.js';
import { Order}  from '../models/orderModel.js';
import {User} from '../models/userModel.js';
import {Product} from '../models/productModel.js'
import crypto from 'crypto';
import { Cart } from '../models/cartModel.js';
import { Aggregate } from 'mongoose';

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
            res.status(400).json({ success:false, message: "Invalid payment signature" });
        }
    } catch (error) {
        res.status(500).json({ success:false, message: error.message });
    }
}

export const getMyOrder = async (req, res) => {
    try {
        const userId = req.user._id
        const orders = await Order.find({user:userId})
        .populate({path:"products.productId", select:"productName productPrice productImg"})
        .populate("user", "firstName lastName email")

        res.status(200).json({success:true, count:orders.length, orders,})
    } catch (error) {
        console.error("Error fetching user Orders", error)
        res.status(500).json({success:false, message:"error geting orders"})
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const {userId} = req.params
        const orders = await Order.find({user:userId})
        .populate({
            path:"products.productId",
            select:"productName productPrice productImg"
        })
        .populate("user","firstName lastName email")

        res.status(200).json({success:true, count:orders.length, orders})
    } catch (error) {
        console.log("No such User found", error)
        res.status(500).json({success:false, message:"error getting Users Orders details"})
    }
}

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await Order.find()
        .sort({createdAt: -1})
        .populate("user","firstName lastName email")
        .populate("products.productId", "productName productPrice");

        console.log(JSON.stringify(orders, null, 2));

        res.status(200).json({success:true, count:orders.length, orders})
    } catch (error) {
        console.log("error fetching orders for admin", error)
        res.status(500).json({success:false, message: "error fetching user's data for admin"})
    }
}

export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({})
        const totalProducts = await Product.countDocuments({})
        const totalOrders = await Order.countDocuments({status:"Paid"})

        //total sales amount
        const totalSaleAgg = await Order.aggregate([
            {$match:{status:"Paid"}},
            {$group:{_id:null, total:{$sum:"$amount"}}}
        ])

        const totalSales = totalSaleAgg[0]?.total || 0

        //Sales grouped by date  (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30)

        const salesByDate = await Order.aggregate([
            {$match:{status:"Paid", createdAt:{$gte:thirtyDaysAgo}}},
            {
                $group:{
                    _id:{
                        $dateToString:{
                            format:"%Y-%m-%d", date: "$createdAt"
                        }
                    }, 
                    amount:{
                        $sum:"$amount"
                    },
                }
            },
            {$sort:{_id:1}}
        ])
         console.log(salesByDate)
        const formattedSales = salesByDate.map((item)=> ({
            date:item._id,
            amount:item.amount
        }))
         console.log(formattedSales)

         res.status(200).json({success:true, message:"fetching sales data", totalOrders, totalProducts, totalUsers, totalSales, sales:formattedSales})
         
    } catch (error) {
        console.error("error getting sales data", error)
        res.status(500).json({success:false, message:"error getting Sales Data"})
    }
}