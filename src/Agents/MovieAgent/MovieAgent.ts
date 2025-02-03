import { RunnableConfig } from '@langchain/core/runnables';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { AIMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { AgentState } from '../../State/State';
import { END } from '@langchain/langgraph';
import { getMovieRecommendation } from './MovieTools';

const llm = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  temperature: 0,
});

// Recall llm was defined as ChatOpenAI above
// It could be any other language model
const movieAgent = createReactAgent({
  llm,
  tools: [getMovieRecommendation],
  stateModifier: new SystemMessage(
    `You are a movie critic and specialist, you love movies and you love to give recommendations` +
      `on movies plus give a summary on their plot when asking to a recommendation`,
  ),
});

export const moviesNode = async (state: typeof AgentState.State, config?: RunnableConfig) => {
  try {
    const result = await movieAgent.invoke(state, config);

    if (!result || !result.messages || result.messages.length === 0) {
      throw new Error('❌ movieAgent response is empty!');
    }

    const lastMessage = result.messages[result.messages.length - 1];

    if (!lastMessage) throw new Error('❌ No last message found in movieAgent response!');

    return {
      messages: [
        new AIMessage({
          content: lastMessage.content.toString(),
          name: 'Movies',
        }),
      ],
      next: END, // Ensure `next` is set correctly
    };
  } catch (error) {
    console.error('❌ Error in moviesNode:', error);
    return {
      messages: [
        new AIMessage({ content: 'I encountered an error. Try again later.', name: 'Movies' }),
      ],
      next: END, // Ensure the graph does not get stuck
    };
  }
};
