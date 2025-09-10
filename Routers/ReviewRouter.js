const reviewController = require("../Controllers/ReviewController");
const authMiddleware = require("../Middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.post("/addrating",authMiddleware, reviewController.add);

router.delete("/removereview",authMiddleware, reviewController.remove);

router.get("/alluserreview",authMiddleware, reviewController.getUserReviews);

module.exports = router;