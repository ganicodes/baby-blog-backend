const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

router.post("/", async (req, res) => {

    const newCategory = new Category(req.body);
    try {
        const savedCategory = await newCategory.save();
        res.status(200).json({ success: true, category: savedCategory })

    } catch (error) {

    }
})

module.exports = router