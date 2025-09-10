const userController = require("../Controllers/UserController");
const passport = require("passport");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authMiddleware = require("../Middleware/authMiddleware");
const isAdmin = require("../Middleware/roleMiddleware");

router.post("/register", userController.Register);

router.post("/login", userController.Login);

router.get("/google",
passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
passport.authenticate("google", { session: false, failureRedirect: "/login" }),
(req, res) => {
    const user = req.user;
    let role = (user.email === "admin@email.com") ? "admin" : "user";
    const token = jwt.sign(
    { 
        _id: user._id,
        email: user.email,
        role:role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    );
    res.json({ token });
}
);

router.get("/facebook",
passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/facebook/callback",
passport.authenticate("facebook", { session: false, failureRedirect: "/login" }),
(req, res) => {
    const user = req.user;
    let role = (user.email === "admin@email.com") ? "admin" : "user";
    const token = jwt.sign(
    { 
        _id: user._id,
        email: user.email,
        role:role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    );
    res.json({ token });
}
);
router.get("/me",authMiddleware,userController.getMe);

router.put("/updateme",authMiddleware,userController.updateMe);

router.put("/updatepassword",authMiddleware,userController.updatePassword);

router.get("/allusers",authMiddleware,isAdmin,userController.getAllUsers);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password", userController.resetPassword);
module.exports = router;