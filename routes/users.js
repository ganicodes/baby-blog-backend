const express = require('express');
const router = express.Router();
const { verifyUser } = require('../utils/verifyToken.js');
const bcrypt = require('bcryptjs');

const Users = require('../models/Users.js');


//update userdetails endpoint
router.put("/:id", verifyUser, async (req, res) => {
    if (req.body.password) {
        //SECURING THE PASSWORD BEFORE SAVING IT INTO DB
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    try {
        await Users.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({ success: true, message: "User details updated successfully" })
    } catch (error) {
        res.status(400).json({ success: false, message: "Can not update the user" })
    }
})
//delete userdetails endpoint
// DELETE
router.delete("/:id", verifyUser, async (req, res) => {

    try {
        const user = await Users.findById(req.params.id);
        if (!user) { res.status(404).json({ success: false, message: "User does not exists" }); }

        await Users.findByIdAndDelete(req.params.id);
        res.status(200).json(({ success: true, message: "Deleted Successfully" }));

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

//Get user details
router.get("/:id", verifyUser, async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        const { password, ...otherDetails } = user._doc;
        res.status(200).json({ success: true, userDetails: otherDetails })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

module.exports = router