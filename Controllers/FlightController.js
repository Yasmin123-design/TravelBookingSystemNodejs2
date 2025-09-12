
const { json } = require("express");
const FlightModel = require("../Models/FlightModel");

module.exports = 
{
async  createFlight(req, res) {
    try {
    const result = await FlightModel.createFlight(req.body);
    res.status(201).json(result);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
},

async  getAllFlights(req, res) {
    try {
    const flights = await FlightModel.findAllFlights();
    res.json(flights);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
},

async  getFlightById(req, res) {
    try {
    const flight = await FlightModel.findFlightById(req.params.id);
    if (!flight) return res.status(404).json({ error: "Flight not found" });
    res.json(flight);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
},

async  updateFlight(req, res) {
    try {
    const result = await FlightModel.updateFlight(req.params.id, req.body);
    res.json(result);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
},

async  deleteFlight(req, res) {
    try {
    const result = await FlightModel.deleteFlight(req.params.id);
    res.json(result);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
},
async searchFlightsByFromTo(req, res) {
    try {
    const { from, to } = req.query;

    const flights = await FlightModel.searchFlightsByFromTo({ from, to});

    if (!flights || flights.length === 0) {
        return res.status(404).json({ message: "No flights found" });
    }

    res.json(flights);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
},
async searchFlightsByPrice(req, res) {
    try {
    const { minprice, maxprice } = req.query;

    const flights = await FlightModel.searchFlightsByPrice({ minprice, maxprice});

    if (!flights || flights.length === 0) {
        return res.status(404).json({ message: "No flights found" });
    }

    res.json(flights);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
}
}