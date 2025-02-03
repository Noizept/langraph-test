import { MongoClient } from 'mongodb';
import fs from 'fs';

// MongoDB Connection URI
const MONGO_URI = 'mongodb://root:rootpassword@localhost:27017/'; // Change if necessary
const DATABASE_NAME = 'moviedb'; // Change to your database
const COLLECTION_NAME = 'movies';

// Read and Parse JSON File
const rawData = fs.readFileSync(
  '/Users/sergioviula/Desktop/AI/langraph ts/dataset/movies.json',
  'utf8',
);
const jsonData = JSON.parse(rawData);

// Extract movies from "rows" field
const movies = jsonData.rows.map((entry: any) => entry.row);

async function insertMovies() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Insert movies into MongoDB
    const result = await collection.insertMany(movies);
    console.log(`Inserted ${result.insertedCount} movies into the database`);
  } catch (error) {
    console.error('Error inserting movies:', error);
  } finally {
    await client.close();
  }
}

// Run the function
insertMovies();
