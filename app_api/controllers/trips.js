const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find();
        if (!Array.isArray(trips) || trips.length === 0) {
            return res.status(404).json({ message: 'No trips found' });
        }
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const tripDetail = async (req, res) => {
    try {
        const trip = await Trip.findOne({ code: req.params.tripCode });
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.status(200).json(trip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addTrip = async (req, res) => {
    try {
        const newTrip = new Trip(req.body);
        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateTrip = async (req, res) => {
    try {
        const updatedTrip = await Trip.findOneAndUpdate(
            { code: req.params.tripCode },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedTrip) return res.status(404).json({ message: 'Trip not found' });
        res.status(200).json(updatedTrip);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteTrip = async (req, res) => {
    try {
        const deletedTrip = await Trip.findOneAndDelete({ code: req.params.tripCode });
        if (!deletedTrip) return res.status(404).json({ message: 'Trip not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const fetchTripsForView = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/trips');
        if (!response.ok) throw new Error('Failed to fetch trips');
        return await response.json();
    } catch (err) {
        console.error(err);
        return [];
    }
};

module.exports = { tripsList, tripDetail, addTrip, updateTrip, deleteTrip, fetchTripsForView };