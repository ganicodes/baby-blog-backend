const jwt = require('jsonwebtoken');

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
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    });
};


module.exports = { verifyToken, verifyUser };