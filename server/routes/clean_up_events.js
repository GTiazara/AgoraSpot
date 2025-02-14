const express = require("express");
const router = express.Router();
const getConnectedClient = require("../db/connect");

router.get("/", async (req, res) => {
    try {
        // Get the database
        const db = await getConnectedClient();

        // Fetch events from the collection
        const events = await db.collection("events")
        console.log(events)
        // Get current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split("T")[0];

        // Delete events where endDate is before the current date
        const result = await events.deleteMany({
            "properties.endDate": { $lt: currentDate },
        });

        res.json({ message: "Cleanup completed", deletedCount: result.deletedCount });

    } catch (error) {
        console.error("Error during cleanup:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
