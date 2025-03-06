const express = require("express");
const router = express.Router();
const getConnectedClient = require("../db/connect");

router.get("/", async (req, res) => {
    try {
        // Get the database
        const db = await getConnectedClient();

        // Fetch events from the collection
        const events = await db.collection("events")
            .find({}) // You can also use filters if needed
            .toArray();
        // console.log(events)
        // Respond with events as GeoJSON features
        const geoJSON = {
            type: "FeatureCollection",
            features: events.map(event => ({
                type: "Feature",
                geometry: event.geometry, // GeoJSON point data
                properties: event.properties, // Additional event data like description, dates, etc.
                id: event._id
            }))
        };

        // console.log("all data", geoJSON)

        res.json({ events: geoJSON.features });

    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
