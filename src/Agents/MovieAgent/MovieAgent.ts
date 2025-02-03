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
  const result = await movieAgent.invoke(state, config);
  const lastMessage = result.messages[result.messages.length - 1];
  return {
    messages: [
      new AIMessage({
        content: lastMessage.content,
        // Put the "Workflow" label in additional_kwargs if you want it for your logs
        name: 'Movies', // Correctly pass the `name` field
      }),
    ],
    next: END,
  };
};
