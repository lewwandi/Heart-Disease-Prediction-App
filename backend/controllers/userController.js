const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");



const createToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

//login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Invalid email or password" });
        }


        const token = createToken(user);

        res.status(200).json({ email: user.email, token });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
};

//signup user
const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body


        const user = await User.signup(email, password)

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        //create a token
        const token = createToken(user._id)


        res.status(200).json({ email: user.token, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


module.exports = { signupUser, loginUser };