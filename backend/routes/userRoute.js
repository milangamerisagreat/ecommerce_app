import express from "express";
import { 
  register, 
  verify, 
  reVerify, 
  login, 
  logout, 
  forgotPassword, 
  verifyOTP, 
  resetPassword, 
  getUser, 
  getUserById, 
  updateProfile,
  updateAddress,
  changePassword,
  getUsers,
  adminUpdateUser
 } from "../controllers/userController.js";
import { isAdmin, isauthenticated } from "../middleware/isAuthonticated.js";
import upload from "../middleware/multer.js";



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/logout", isauthenticated, logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/reset-password/:email", resetPassword);
router.get("/get-user",  isauthenticated, getUser);
router.get("/get-users", isauthenticated, isAdmin, getUsers );
router.put("/admin/update-user/:userId", isauthenticated, isAdmin, upload.single("profilepic"), adminUpdateUser );
router.get("/get-user/:userId", getUserById);
router.put("/update-profile",isauthenticated,upload.single("profilepic"),updateProfile);
router.put("/update-address",isauthenticated,updateAddress);
router.put("/change-password",isauthenticated,changePassword);



export default router;