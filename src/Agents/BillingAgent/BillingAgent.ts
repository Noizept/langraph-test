import { RunnableConfig } from '@langchain/core/runnables';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { AgentState } from '../../State/State';
import { getBillingInfo, getRefundContact } from './BillingAgentTools';
import { END } from '@langchain/langgraph';

const llm = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  temperature: 0,
});

// Recall llm was defined as ChatOpenAI above
// It could be any other language model
const billingAgent = createReactAgent({
  llm,
  tools: [getRefundContact, getBillingInfo],
  stateModifier: new SystemMessage(
    'You are responsible for handling billing-related tasks, including retrieving billing information and providing refund contact details. Be concise and accurate in your responses.',
  ),
});

export const billingNode = async (state: typeof AgentState.State, config?: RunnableConfig) => {
  const result = await billingAgent.invoke(state, config);
  const lastMessage = result.messages[result.messages.length - 1];
  return {
    messages: [
      new AIMessage({
        content: lastMessage.content,
        name: 'Billing', // Correctly pass the `name` field
      }),
    ],
    next: END, // Pass control back to the supervisor
  };
};
