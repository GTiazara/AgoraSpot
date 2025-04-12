const express = require("express");
const router = express.Router();
const getConnectedClient = require("../db/connect");
const { GoogleGenerativeAI, DynamicRetrievalMode } = require("@google/generative-ai");
const { countries } = require('countries-list');
const { Mistral } = require('@mistralai/mistralai');
const youtubesearchapi = require("youtube-search-api");
// const { JsonSchema$inboundSchema } = require("@mistralai/mistralai/models/components");

const config = require("dotenv").config();


const GEMINI_API_KEY = process.env.GEMINI_API_KEY || config.parsed.GEMINI_API_KEY;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
router.get("/", async (req, res) => {
    try {
        // Get the database
        const db = await getConnectedClient();
        const eventsCollection = db.collection("events");

        // Get current timestamp
        const now = new Date();
        const xLimiteTimeAgo = new Date(now.getTime() - 1 * 60 * 1000); // (- x min * ....)
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

        console.log("No valid events found. Generating new one...");

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        // tools: [
            //     {
            //       googleSearch: {
                  
            //       },
            //     },
            //   ],

        const countryCodes = Object.keys(countries); // Get all country codes
        const randomCode = countryCodes[Math.floor(Math.random() * countryCodes.length)]; // Pick a random code
        const randomCountry = countries[randomCode].name; // Get the country name

        console.log("randomCountry", randomCountry);


        const prompt = `My app generates facts about a location. Generate true fact (funny or serious)that gives people dream to travel to a random city of ${randomCountry} (anywhere, from big to little facts or events, make sure it's unique at each request and from any cities, big or little)
         as geojson type Feature format with properties (fact, address, precise location of the address ). The coordinate of the geojson must be a pecise geocoding ot the address and return only the geosjon.`;

        const clientMistral = new Mistral({apiKey: MISTRAL_API_KEY});

        let result = await model.generateContent(prompt);
        
        console.log(result.response.text());

        // Regular expression to match content within ```json and ```
        const jsonRegex = /```json([\s\S]*?)```/;

        // Extract the JSON content
        let match = result.response.text().match(jsonRegex);

        let jsonObject=null
        if (match) {
        const jsonContent = match[1].trim();
        console.log("Extracted JSON Content:", jsonContent);

        // Parse the JSON content
            try {
                jsonObject = JSON.parse(jsonContent);
                console.log("Parsed JSON Object:", jsonObject);
            } catch (error) {
                console.error("Invalid JSON content:", error);
            }
        } else {
            console.log("No JSON content found within triple backticks.");
        }

        let jsonResult = jsonObject //JSON.parse(result.response.text().replace("```json", "").replace("```", ""))

        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 2); // + day

        const event_to_add = {
            geometry: jsonResult.geometry, // Inserting the location as GeoJSON
            properties: {
                tags: ["location_random_fact"],
                startDate: new Date().toISOString(),
                endDate: endDate.toISOString(),
                startTime: "00:00",
                endTime: "23:59",
                description: `${jsonResult.properties.fact} Address: ${jsonResult.properties.address}`,
                eventImage: "",
                infoSource: "gemini",
                createdAt: new Date(), // You may use `createdAt` in properties as per the GeoJSON format
            },
        }

        
        const chatResponse = await clientMistral.chat.complete({
            model: "mistral-large-latest",
            messages: [{role: 'user', content: `convert this into a you tube search short sentence that will retrun  the most relevant video and return only the sentence as json as key sentence:  ${jsonResult.properties.fact}`}]
        });

        console.log("mistral chat:",  chatResponse.choices[0].message.content);

        let youtube_search_json = chatResponse.choices[0].message.content

        // Extract the JSON content
        youtube_search_json = youtube_search_json.match(jsonRegex);
        if (youtube_search_json) {
            youtube_search_json = youtube_search_json[1].trim();
        console.log("Extracted JSON Content:", youtube_search_json);

        // Parse the JSON content
            try {
                youtube_search_json = JSON.parse(youtube_search_json);
                console.log("Parsed JSON Object:", youtube_search_json);
                console.log("youtube_search_json.sentence", youtube_search_json.sentence)
            } catch (error) {
                console.error("Invalid JSON content:", error);
            }
        } else {
            console.log("No JSON content found within triple backticks.");
        }


        let you_tube_search = await  youtubesearchapi.GetListByKeyword(youtube_search_json.sentence + ': documentaries',true) //,1
        console.log(you_tube_search)
        let you_tube_search_res = you_tube_search
        console.log(you_tube_search_res)
        let id = you_tube_search_res["items"][0]["id"]
        console.log(id)

        event_to_add.properties.eventImage= `https://www.youtube.com/embed/${id}`




        jsonResult.properties.eventImage=event_to_add.properties.eventImage

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
