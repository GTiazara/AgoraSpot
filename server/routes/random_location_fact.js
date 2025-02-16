const express = require("express");
const router = express.Router();
const getConnectedClient = require("../db/connect");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { countries } = require('countries-list');


const config = require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || config.parsed.GEMINI_API_KEY;
router.get("/", async (req, res) => {
    try {
        // Get the database
        const db = await getConnectedClient();
        const eventsCollection = db.collection("events");

        // Get today's date
        // const today = new Date();
        // today.setHours(0, 0, 0, 0);

        // Find existing events with the "location_random_fact" tag
        // const events = await eventsCollection.find({ "properties.tags": "location_random_fact" }).toArray();

        // console.log("Existing events:", events);

        // Check if any event exists and is within 1 day from its creation
        // let validEvents = events.filter(event => {
        //     const createdAt = new Date(event.properties.createdAt);
        //     const oneDayAgo = new Date(today);
        //     oneDayAgo.setDate(today.getDate() - 1);
        //     return createdAt >= oneDayAgo;
        // });

        // Get current timestamp
        const now = new Date();
        const xLimiteTimeAgo = new Date(now.getTime() - 5 * 60 * 1000); // 
        console.log(now)
        console.log(xLimiteTimeAgo)
        // Find existing events with the "location_random_fact" tag created within the last hour
        const events = await eventsCollection.find({
            "properties.tags": "location_random_fact",
            "properties.createdAt": { $gte: xLimiteTimeAgo } // Only fetch events created within the last hour
        }).toArray();

        console.log("Existing events within the last hour:", events);

        // If valid events exist, return them
        if (events.length > 0) {
            return res.json({
                message: "Existing valid events found.",
                code: "cant_add_new_fact",
                events: events.map(event => ({
                    type: "Feature",
                    geometry: event.geometry,
                    properties: event.properties,
                    id: event._id
                }))
            });
        }

        // If we have valid events, return them
        // if (validEvents.length > 0) {
        //     console.log("Returning existing valid events.");
        //     return res.json({
        //         events: validEvents.map(event => ({
        //             type: "Feature",
        //             geometry: event.geometry,
        //             properties: event.properties,
        //             id: event._id
        //         }))
        //     });
        // }

        console.log("No valid events found. Generating new one...");

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const countryCodes = Object.keys(countries); // Get all country codes
        const randomCode = countryCodes[Math.floor(Math.random() * countryCodes.length)]; // Pick a random code
        const randomCountry = countries[randomCode].name; // Get the country name

        console.log("randomCountry", randomCountry);


        const prompt = `my app generates facts about a location.
        Generate true fact (funny or serious)that give people drean to tranvel to a random city of ${randomCountry} (anywhere, from big to little fact event, make sure it's unique at each request and from any county, cities, big or little)
         as geojson type Feature format with properties (fact, adress, precise location of the adress). the coordinate of the geojson must be a pecise location ot the address and return only the geosjon`;


        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        let jsonResult = JSON.parse(result.response.text().replace("```json", "").replace("```", ""))


        const event_to_add = {
            geometry: jsonResult.geometry, // Inserting the location as GeoJSON
            properties: {
                tags: ["location_random_fact"],
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                startTime: "00:00",
                endTime: "23:59",
                description: `${jsonResult.properties.fact} Address: ${jsonResult.properties.address}`,
                eventImage: "",
                infoSource: "gemini",
                createdAt: new Date(), // You may use `createdAt` in properties as per the GeoJSON format
            },
        }

        console.log(event_to_add);


        const result_insert = await db.collection("events").insertOne(event_to_add);



        res.status(201).json({
            message: "Ai chat successfully, new random fact added.",
            // Optionally, return inserted event data
            ai_response: jsonResult,
            code: "new_fact_added",
            prompt: prompt,
        });


    } catch (error) {
        console.error("Error ai chat event:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
