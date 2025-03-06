const { MongoClient, ServerApiVersion } = require("mongodb");
const config = require("dotenv").config();

const connectionString = process.env.ATLAS_URI || config.parsed.ATLAS_URI;
console.log("connectionString:", connectionString);

const client = new MongoClient(connectionString, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let conn;
const getConnectedClient = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        conn = await client.connect();
        console.log("Connection established.");

        const db = conn.db("agora");

        // Check if `events` collection exists
        const collections = await db.listCollections({ name: "events" }).toArray();

        if (collections.length === 0) {
            console.log("Creating the `events` collection...");

            // Define GeoJSON schema validation for the `location` field and event properties
            await db.createCollection("events", {
                validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["geometry", "properties"],
                        properties: {
                            geometry: {
                                bsonType: "object",
                                required: ["type", "coordinates"],
                                properties: {
                                    type: {
                                        enum: ["Point"],
                                        description: "Location type must be 'Point'.",
                                    },
                                    coordinates: {
                                        bsonType: "array",
                                        items: { bsonType: "double" },
                                        minItems: 2,
                                        maxItems: 2,
                                        description: "Coordinates must be an array of [longitude, latitude] as doubles.",
                                    },
                                },
                            },
                            properties: {
                                bsonType: "object",
                                required: ["tags", "startDate", "endDate", "startTime", "endTime"],
                                properties: {
                                    tags: {
                                        bsonType: "array",
                                        items: { bsonType: "string" },
                                        description: "Tags for the event must be an array of strings.",
                                    },
                                    startDate: {
                                        bsonType: "string",
                                        description: "The start date must be a string in 'YYYY-MM-DD' format.",
                                    },
                                    endDate: {
                                        bsonType: "string",
                                        description: "The end date must be a string in 'YYYY-MM-DD' format.",
                                    },
                                    startTime: {
                                        bsonType: "string",
                                        description: "The start time must be a string in 'HH:mm' format.",
                                    },
                                    endTime: {
                                        bsonType: "string",
                                        description: "The end time must be a string in 'HH:mm' format.",
                                    },
                                    description: {
                                        bsonType: "string",
                                        description: "Description of the event (optional).",
                                    },
                                    participants: {
                                        bsonType: "object",
                                        // items: { bsonType: "string" },
                                        description: "List of participants (optional).",
                                    },
                                    eventImage: {
                                        bsonType: "string",
                                        description: "Image.",
                                    },
                                    infoSource: {
                                        bsonType: "string",
                                        description: "Source.",
                                    },
                                    createdAt: {
                                        bsonType: "date",
                                        description: "Creation date of the event. Will be set on insert.",
                                    },
                                    eventVideo: {
                                        bsonType: "string",
                                        description: "video",
                                    },
                                    eventChat: {
                                        bsonType: "object",
                                        description: "chat",
                                    },


                                },
                            },
                        },
                    },
                },
            });

            console.log("`events` collection created.");
        } else {
            console.log("`events` collection already exists.");
        }

        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

module.exports = getConnectedClient;
