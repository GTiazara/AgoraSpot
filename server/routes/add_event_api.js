const express = require("express");
const router = express.Router();
const getConnectedClient = require("../db/connect");

router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        // Destructuring input data from request body
        const { tags, startDate, endDate, startTime, endTime, location, description, eventImage, infoSource } = req.body;

        // Validate required fields
        if (!tags || !startDate || !endDate || !startTime || !endTime || !location) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate location format: Ensure the location is a valid GeoJSON Point
        if (!location.lat || !location.lng) {
            return res.status(400).json({
                error: "Invalid location data. Must contain lat and lng properties.",
            });
        }

        // Transform location to GeoJSON Point format
        const geoLocation = {
            type: "Point",
            coordinates: [location.lng, location.lat], // MongoDB expects [longitude, latitude]
        };

        // Get the database and insert event
        const db = await getConnectedClient();
        const result = await db.collection("events").insertOne({
            geometry: geoLocation, // Inserting the location as GeoJSON
            properties: {
                tags,
                startDate,
                endDate,
                startTime,
                endTime,
                description,
                eventImage,
                infoSource,
                createdAt: new Date(), // You may use `createdAt` in properties as per the GeoJSON format
            },
        });

        console.log(result);

        res.status(201).json({
            message: "Event created successfully",
            // Optionally, return inserted event data
            eventId: result.insertedId,
        });
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
