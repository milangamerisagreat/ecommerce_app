import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({                                                                                                    
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilepic: { type: String, default: '' }, // cloudinary URL for profile picture
    profilepicpublicid: { type: String, default: '' }, // cloudinary public ID for profile picture
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },                         
    role: { type: String, enum: ['user', 'admin'], default: 'user' },  
    tokens: { type: String, default:null }, 
    isVerified: { type: Boolean, default:false },
    isLoggedin: { type: Boolean, default:false },
    otp: { type: String, default:null },
    otpExpiry: { type: Date, default:null },
    address: { type: String, default:'' },
    city: { type: String, default:'' },
    zipcode: { type: String, default:'' },
    phoneNo: { type: String, default:'' },
}, 

{ timestamps: true }
);

export const User = mongoose.model('User', userSchema);    