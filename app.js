require("dotenv").config();
require("./Config/passport"); 
const express = require("express");
const cors = require("cors");  
const passport = require("passport");
const userRoutes = require("./Routers/UserRouter");
const flightRoutes = require("./Routers/FlightRouter");
const bookingRoutes = require("./Routers/BookingRouter");
const paymentRoutes = require("./Routers/PaymentRouter");
const wishlistRoutes = require("./Routers/WishlistRouter");
const reviewRoutes = require("./Routers/ReviewRouter")
const app = express();

const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use("/users", userRoutes);
app.use("/flights",flightRoutes);
app.use("/booking",bookingRoutes);
app.use("/payment",paymentRoutes);
app.use("/wishlist",wishlistRoutes);
app.use("/review",reviewRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
