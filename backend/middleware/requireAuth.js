const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
    try {

        if (!req.headers || !req.headers.authorization) {
            console.error("Authorization header is missing.");
            return res.status(401).json({ error: "Authorization token required." });
        }

        console.log("Authorization Header Received:", req.headers.authorization);

        // ✅ Ensure correct token format "Bearer <token>"
        const tokenParts = req.headers.authorization.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            console.error("Invalid token format. Expected 'Bearer <token>'.");
            return res.status(401).json({ error: "Invalid token format. Use 'Bearer <token>'." });
        }


        let token = tokenParts[1].trim();

        // ✅ Ensure the token is in proper JWT format
        const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        if (!jwtPattern.test(token)) {
            console.error("Token format is incorrect.");
            return res.status(401).json({ error: "Invalid token format." });
        }

        console.log("Extracted Token:", token);

        // ✅ Verify JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // if (!decoded || !decoded._id) {
        //     console.error("Invalid token structure.");
        //     return res.status(401).json({ error: "Invalid token structure." });
        // }

        // ✅ Check if user exists in the database
        req.user = await User.findById(decoded._id).select("_id");
        if (!req.user) {
            console.error("User not found in database.");
            return res.status(401).json({ error: "User not found, unauthorized request." });
        }

        console.log("User found:", req.user);
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = requireAuth;
