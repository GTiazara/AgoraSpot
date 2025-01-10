const { MongoClient, ServerApiVersion } = require("mongodb");

const config = require('dotenv').config()

console.log(config)
const connectionString = config.parsed.ATLAS_URI;
console.log("connectionString", connectionString)




const client = new MongoClient(connectionString, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let conn;
const get_db = async () => {
    try {
        console.log("try connect")
        conn = await client.connect();
        console.log("Connection established:", conn);
        const db = conn.db("sample_training");
        return db;
    } catch (e) {
        console.error("Connection error:", e);
    }



};
const db = get_db()
module.exports = db;
