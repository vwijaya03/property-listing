import path from 'path';
import { fileURLToPath } from 'url';
import { createInstance } from 'daftar-properti-sync';
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
// import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables
config({ path: path.join(__dirname, '../.env') });

const PROVIDER_URL = process.env.BLOCKCHAIN_PROVIDER_URL;
const ABI_VERSION = process.env.DP_ABI_VERSION;

// MongoDB Configuration
const MONGO_URI = process.env.DB_URL;
const DB_NAME = process.env.DB_DATABASE;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

// Error Notification Configuration
const ERROR_NOTIF_CHANNEL = process.env.ERROR_NOTIF_CHANNEL;
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function main() {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const listingCollection = client.db(DB_NAME).collection(COLLECTION_NAME);

        const options = {
            port: 8050,
            address: process.env.DP_CONTRACT_ADDRESS,
            strictHash: true,
            providerHost: PROVIDER_URL,
            fetchAll: false,
            abiVersion: Number(ABI_VERSION),
            fromBlockNumber: 0,
            listingCollection: listingCollection,
            listingHandler: null,
            errorHandling: {
              errorChannel: ERROR_NOTIF_CHANNEL,
              slackConfiguration: {
                slackWebhookURL: SLACK_WEBHOOK_URL
              },
            },
        };

        const instance = createInstance(options);

        await instance.start();
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

main();