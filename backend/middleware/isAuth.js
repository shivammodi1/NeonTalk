const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.userId) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("JWT Error:", error.message);
        return res.status(401).json({ message: "Unauthorized - Token failed" });
    }
};

module.exports = isAuth;
