const express = require("express")
const router = express.Router();
const Posts = require("../models/Posts");
const { verifyUser, verifyAuthor, verifyToken } = require("../utils/verifyToken");

//Create
router.post("/", verifyToken, async (req, res) => {
    try {
        const post = await Posts.findOne({ title: req.body.title });

        if (post) {
            res.status(400).json({ success: false, message: "A blog post with same title already exist" })
        }
        const newPost = new Posts(req.body)
        await newPost.save();
        res.status(200).json({ success: true, message: "Post created successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

//Update
router.put("/:id", verifyAuthor, async (req, res) => {
    try {
        await Posts.findByIdAndUpdate
            (req.params.id, { $set: req.body }, { new: true });
        res.status(200).json({ success: true, message: "Post updated successfully" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})


// Delete
router.delete("/:id", verifyAuthor, async (req, res) => {
    try {
        await Posts.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Post deleted successfully" })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

// Get
router.get("/:id", async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        if (!post) { res.status(404).json({ success: false, message: "Post does not exists" }); }

        res.status(200).json({ success: true, post: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

// Get All
router.get("/", async (req, res) => {
    const category = req.query.category;
    const author = req.query.author;
    try {
        let posts;
        if (author) {
            posts = await Posts.find({ author: author });
        } else if (category) {
            posts = await Posts.find({ categories: { $in: [category] } });
        } else {
            posts = await Posts.find();
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})


module.exports = router 
