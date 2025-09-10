const wishlistController = require("../Controllers/WishlistController");
const authMiddleware = require("../Middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.post("/addtowishlist",authMiddleware, wishlistController.add);

router.delete("/removefromwisglist/:id",authMiddleware, wishlistController.remove);

router.get("/alluserwishlist",authMiddleware, wishlistController.list);

module.exports = router;