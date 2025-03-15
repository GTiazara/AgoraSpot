const express = require("express");
const router = express.Router();
const getConnectedClient = require("../db/connect");
const { ObjectId } = require("mongodb");

// Route to add a participant to an event
router.post("/", async (req, res) => {
    try {
        // Destructure eventId and participantName from the request body
        const { eventId, last_message_id_on_screen } = req.body;

        console.log({  eventId, last_message_id_on_screen })

        // Validate the input
        if (!eventId || !last_message_id_on_screen) {
            return res.status(400).json({ error: "Event ID and participant name are required." });
        }

        // Get the database client
        const db = await getConnectedClient();

        // Create a filter for movies with the title "Random Harvest"

        const filter = { _id: new ObjectId(eventId) };
        console.log(filter)

        // Fetch event's chat messages
        const event = await db.collection("events").findOne(filter, {
            projection: { "properties.eventChat": 1 }
        });

        if (!event || !event.properties || !event.properties.eventChat) {
            res.json({ messages: [] }); // No messages found
        }

        // Extract messages and filter those with ID greater than last_message_id_on_screen
        const newMessages = Object.values(event.properties.eventChat).filter(
            (msg) => msg._id > last_message_id_on_screen
        );

        return res.json({ messages: newMessages });

    } catch (error) {
        console.error("Error getting last messages", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
