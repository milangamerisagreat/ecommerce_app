import { User } from "../models/userModel.js";


export const register = async (req, res) => {
    try {
       const { firstName, lastName, email, password } = req.body;
       if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'All fields are required' });
       }
       const user = await User.findOne({ email });
       if (user) {  
        return res.status(400).json({ 
            success: false,
            message: 'User already exists' });
       }
         const newUser = new User.create({
            firstName,
            lastName,   
            email,
            password
        });
        await newUser.save();
        return res.status(201).json({ 
            success: true,
            user: newUser,
            message: 'User registered successfully' });



    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: 'Error registering user',
            error: error.message });
    }
}