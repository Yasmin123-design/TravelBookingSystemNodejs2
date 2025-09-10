const flightController = require("../Controllers/FlightController");
const authMiddleware = require("../Middleware/authMiddleware");
const isAdmin  = require("../Middleware/roleMiddleware");
const express = require("express");
const router = express.Router();

router.post("/createflight",authMiddleware,isAdmin, flightController.createFlight);

router.get("/allflights", flightController.getAllFlights);

router.get("/flightbyid/:id", flightController.getFlightById);

router.put("/updateflight/:id",authMiddleware,isAdmin, flightController.updateFlight);

router.delete("/deleteflight/:id",authMiddleware,isAdmin, flightController.deleteFlight);

router.get("/searchbyfromto", flightController.searchFlightsByFromTo);

router.get("/searchbyprice", flightController.searchFlightsByPrice);

module.exports = router;