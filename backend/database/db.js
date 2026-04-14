import mongoose from 'mongoose';
import dotenv from 'dotenv';
mongoose.set('strictQuery', true);
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/ecommerce_app`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });     
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); 
  } 
};

export default connectDB;

