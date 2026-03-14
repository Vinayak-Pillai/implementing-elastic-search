import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv"
dotenv.config()
export const esClient = new Client({
    node: process.env["ES_URL"],
    auth: {
        apiKey: process.env["ES_API_KEY"]!
    }
})

export async function checkConnection() {
    try {
        const response = await esClient.info()
        console.log("Connected to Elasticsearch", response)
    } catch (error) {
        console.error("Error connecting to Elasticsearch", error)
    }
}