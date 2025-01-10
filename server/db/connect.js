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
const get_connected_client = async () => {
    try {
        console.log("try connect")
        conn = await client.connect();
        console.log("Connection established:", conn);


        databasesList = await conn.db().admin().listDatabases();

        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));


        return conn;
    } catch (e) {
        console.error("Connection error:", e);
    }



};
conn = get_connected_client()
module.exports = conn;
