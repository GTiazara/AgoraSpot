const express = require("express");
const router = express.Router();
const getConnectedClient = require("../db/connect");
const { ObjectId } = require("mongodb");

// Route to add a participant to an event
router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        // Destructure eventId and participantName from the request body
        const { eventId, chat } = req.body;

        console.log({ eventId, chat })

        // Validate the input
        if (!eventId || !participantName) {
            return res.status(400).json({ error: "Event ID and participant name are required." });
        }

        // Get the database client
        const db = await getConnectedClient();

        // Create a filter for movies with the title "Random Harvest"

        const filter = { _id: new ObjectId(eventId) };

        // Add the participant name to the event's "participants" array
        const result = await db.collection("events").updateOne(
            filter, // Find event by ID
            // { $addToSet: { "properties.participants": { "name": participantName, "comments": participantComments } } }   // Add to 'participants' array, avoiding duplicates
            { $set: { [`properties.eventChat}`]: chat } }
        );

        // Check if the event was found and updated
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Event not found." });
        }

        res.status(200).json({
            message: "chat updated successfully.",
            eventId,
            participantName,
        });
    } catch (error) {
        console.error("Error updating chat:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
