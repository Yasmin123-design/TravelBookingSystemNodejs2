const reviewModel = require("../Models/ReviewModel");
module.exports = {
async  add(req, res) {
    try
    { 
        const userId = req.user._id;
        const {  flightId, rating, comment } = req.body;
        const result = await reviewModel.createReview(userId,flightId,rating,comment);
        res.status(201).json(result);
        } catch (err) {
        res.status(500).json({ error: err.message });
        }
},
    async remove(req, res) {
        try {
            const userId = req.user._id;
            const { flightId } = req.body;

            const result = await reviewModel.deleteReview(userId, flightId);

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "التقييم غير موجود" });
            }

            res.json({ message: "تم حذف التقييم بنجاح" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async getUserReviews(req, res) {
        try {
            const userId = req.user._id;
            const reviews = await reviewModel.getUserReviews(userId);

            res.json(reviews);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

}