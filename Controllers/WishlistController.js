const wishlistModel = require("../Models/WishlistModel");



module.exports = {
async  add(req, res) {
    try {
    const userId = req.user._id; 
    const { flightId } = req.body;
    if (!flightId) return res.status(400).json({ error: "flightId required" });

    const result = await wishlistModel.addToWishlist(userId, flightId);
    return res.json({ message: "Added to wishlist", item: result });
    } catch (err) {
    return res.status(500).json({ error: err.message });
    }
},

async  remove(req, res) {
    try {
    const userId = req.user._id;
    const flightId  = req.params.id;

    await wishlistModel.removeFromWishlist(userId, flightId);

    return res.json({ message: "Removed from wishlist" });

    } catch (err) {
    return res.status(500).json({ error: err.message });
    }
},
async  list(req, res) {
    try {
    const userId = req.user._id;
    const items = await wishlistModel.getUserWishlist(userId);
    return res.json(items);
    } catch (err) {
    return res.status(500).json({ error: err.message });
    }
}

}