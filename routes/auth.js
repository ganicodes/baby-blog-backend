const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

router.post("/signup", async (req, res) => {

    try {
        //checking whether the user already logged in
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: false, error: "Sorry a user with this email already exists" })
        }

        //SECURING THE PASSWORD BEFORE SAVING IT INTO DB
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // CREATING THE NEW USER IN DB
        const newUser = new Users({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(200).json({ success: true, email: newUser.email })
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Internal server error");
    }
})

router.post("/login", async (req, res) => {

    try {
        const user = await Users.findOne({ email: req.body.email });

        if (!user) {
            res.status(404).json("User not found")
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) { res.status(400).json("Invalid credentials") }

        // generating auth-token using JWT
        let token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET);

        const { password, ...otherDetails } = user._doc;
        res.cookie("access_token", token, { httpOnly: true, }).status(200).json({ success: true, userdetails: otherDetails });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

module.exports = router