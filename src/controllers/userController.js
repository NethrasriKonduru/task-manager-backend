// backend/src/controllers/userController.js
// This file MUST contain the signupUser and loginUser functions.

import User from "../models/User.js";
// Assuming you have a utility for JWT token creation
import generateToken from "../utils/generateToken.js"; 
import bcrypt from "bcryptjs"; 

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during signup" });
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        // NOTE: This comparison assumes your User model uses a pre-save hook 
        // to hash the password OR that the password field is correctly being used.
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
};