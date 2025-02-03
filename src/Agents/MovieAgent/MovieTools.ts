import { tool } from '@langchain/core/tools';
import z from 'zod';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

// Initialize Pinecone
const pinecone = new Pinecone({ apiKey: process.env.PINE_CONE_API! });
const indexName = process.env.PINECONE_INDEX_NAME || 'movies';
const namespace = process.env.PINECONE_NAMESPACE || 'ns1';

// Initialize OpenAI Embeddings
const embeddingModel = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-ada-002',
});

// Get Query Embedding
async function getEmbedding(query: string): Promise<number[]> {
  return await embeddingModel.embedQuery(query);
}

// Find Similar Movies using Pinecone
async function findSimilarMovies(query: string) {
  try {
    // Get embedding for user query
    const queryEmbedding = await getEmbedding(query);
    console.log('🔹 Query Embedding:', queryEmbedding.length);

    // Connect to Pinecone index
    const pineconeIndex = pinecone.Index(indexName);

    // Perform similarity search (KNN)
    const queryResult = await pineconeIndex.namespace(namespace).query({
      vector: queryEmbedding,
      topK: 10, // Return top 10 similar movies
      includeMetadata: true, // Retrieve movie details
    });

    const recommendedMovies = queryResult.matches
      .map((match, index) => {
        return `${index + 1}. **${match.metadata?.title}** (${match.metadata?.year || 'Unknown Year'})\nGenre: ${match.metadata?.genre || 'Unknown'}\nPlot: ${match.metadata?.plot || 'No description available.'}`;
      })
      .join('\n\n');

    return recommendedMovies;
  } catch (error) {
    console.error('❌ Error in findSimilarMovies:', error);
    throw new Error('Failed to fetch recommendations.');
  }
}

// LangChain Tool Definition for Pinecone Search
export const getMovieRecommendation = tool(
  async ({ query }) => {
    return await findSimilarMovies(query);
  },
  {
    name: 'getMovieRecommendation',
    description:
      'Fetch movie recommendations based on a similarity search of movie plot embeddings using Pinecone.',
    schema: z.object({
      query: z.string().describe('The query to use for the similarity search.'),
    }),
  },
);
