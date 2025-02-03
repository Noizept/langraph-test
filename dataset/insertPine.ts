import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs';

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINE_CONE_API!,
});
const indexName = 'movies';

function sanitizeId(id: string): string {
  return id
    .normalize('NFKD') // Normalize characters
    .replace(/[^\w\s-]/g, '') // Remove non-ASCII characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toLowerCase();
}

async function insertMoviesIntoPinecone() {
  try {
    const indexName = process.env.PINECONE_INDEX_NAME || 'movies';

    console.log(`🔹 Checking if index "${indexName}" exists...`);

    const index = pinecone.index('movies');

    // Read and Parse JSON File
    const filePath = '/Users/sergioviula/Desktop/AI/langraph ts/dataset/movies.json'; // Update if needed
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    // Extract movies from "rows" field
    if (!jsonData.rows) {
      throw new Error('Invalid JSON structure: "rows" field not found.');
    }

    const movies = jsonData.rows.map((entry: any) => entry.row);
    console.log(`✅ Loaded ${movies.length} movies from JSON.`);

    // Connect to Pinecone Index
    const pineconeIndex = pinecone.Index(indexName);

    // Convert movies into Pinecone vector format
    const vectors = movies
      .filter((movie: any) => Array.isArray(movie.plot_embedding)) // Ensure valid embeddings
      .map((movie: any) => ({
        id: sanitizeId(movie.title), // Ensure ASCII-compatible ID
        values: movie.plot_embedding, // The embedding vector
        metadata: {
          title: movie.title,
          plot: movie.plot,
          genre: movie.genre || 'unknown',
          year: movie.year || 'unknown',
        },
      }));

    await index.namespace('ns1').upsert(vectors);
    console.log('🎉 All movies successfully inserted into Pinecone!');
  } catch (error) {
    console.error('❌ Error inserting movies into Pinecone:', error);
  }
}

// Run the function
insertMoviesIntoPinecone();
