import express from "express";
import { register, verify, reVerify, login, logout, forgotPassword, verifyOTP, resetPassword, getUser, getUserById } from "../controllers/userController.js";
import { isAdmin, isauthenticated } from "../middleware/isAuthonticated.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/logout", isauthenticated, logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", resetPassword);
router.get("/get-user", isauthenticated, isAdmin, getUser);
router.get("/get-user/:userId",  getUserById);


export default router;