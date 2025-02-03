import { tool } from '@langchain/core/tools';
import z from 'zod';
import mongoDb from '../../DB/mongoDb';

import { OpenAIEmbeddings } from '@langchain/openai';
import { similarity } from 'ml-distance';

const embeddingModel = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-ada-002',
});

async function getEmbedding(query: string): Promise<number[]> {
  return await embeddingModel.embedQuery(query);
}

async function findSimilarMovies(query: string) {
  try {
    // Get the query embedding
    const queryEmbedding = await getEmbedding(query);
    console.log('🔹 Query Embedding:', queryEmbedding);

    const dbInstance = await mongoDb.getInstance();
    const collection = dbInstance.collection('movies');

    // Fetch all movies
    const movies = await collection.find({}).toArray();
    console.log('✅ Retrieved Movies:', movies.length);

    console.log('mongo lenght:', movies[0].plot_embedding.length);
    console.log('queryEmbedding lenght:', queryEmbedding.length);

    // Check if plot_embedding exists
    if (!movies.length || !movies[0].plot_embedding) {
      throw new Error('No valid embeddings found in database.');
    }

    // Compute cosine similarity manually
    const scoredMovies = movies
      .map((movie) => ({
        ...movie,
        score: similarity.cosine(queryEmbedding, movie.plot_embedding),
      }))
      .sort((a, b) => b.score - a.score) // Sort by similarity
      .slice(0, 10); // Return top 10

    console.log('🎯 Recommended Movies:', scoredMovies);
    return scoredMovies;
  } catch (error) {
    // console.error('❌ Error in findSimilarMovies:', error);
    throw new Error();
  }
}

export const getMovieRecommendation = tool(
  async ({ query }) => {
    // First, get the query embedding
    const movies = await findSimilarMovies(query);

    return movies;
  },
  {
    name: 'getMovieRecommendation',
    description:
      'Fetch movie recommendations based on a similarity search of movie plot embeddings using the provided query.',
    schema: z.object({
      query: z.string().describe('The query to use for the similarity search.'),
    }),
  },
);
