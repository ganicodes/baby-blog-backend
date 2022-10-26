const jwt = require('jsonwebtoken');
const Posts = require('../models/Posts');

const verifyToken = (req, res, next) => {
    let token = req.cookies.access_token;

    if (!token) {
        res.status(401).json({ success: false, message: "Not authenticated" })
    }


    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();

}

const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            res.status(403).json({ success: false, message: "You are not authorized" })
        }
    });
};

const verifyAuthor = (req, res, next) => {
    verifyToken(req, res, async () => {
        const post = await Posts.findById(req.params.id);

        if (!post) { res.status(404).json({ success: false, message: "Post does not exists" }); }

        console.log(post);
        console.log(req.user);

        if (req.user.name === post.author) {
            next();
        } else {
            res.status(403).json({ success: false, message: "You are not authorized" })
        }
    });
};

module.exports = { verifyToken, verifyUser, verifyAuthor };