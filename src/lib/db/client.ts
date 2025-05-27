import { MongoClient, Db } from 'mongodb';

const uri = process.env.DB_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_DATABASE || 'real-estate';

let client: MongoClient;
let cachedDb: Db | null = null; // Explicitly type as Db

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  try {
    client = new MongoClient(uri);
    await client.connect();
    cachedDb = client.db(dbName);
    return cachedDb;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}

// Add proper cleanup for development
if (import.meta.hot) {
  import.meta.hot.dispose(async () => {
    if (client) await client.close();
  });
}