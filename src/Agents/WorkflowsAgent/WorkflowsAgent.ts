import { RunnableConfig } from '@langchain/core/runnables';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getWorkflowByDescription } from './WorkflowsAgentTools';
import { ChatOpenAI } from '@langchain/openai';
import { AgentState } from '../State';

const llm = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  temperature: 0,
});

// Recall llm was defined as ChatOpenAI above
// It could be any other language model
const workflowAgent = createReactAgent({
  llm,
  tools: [getWorkflowByDescription],
  stateModifier: new SystemMessage(
    'You are a workflow agent retrieval specialist, everytime a user asks for suggestion on what workflow' +
      'they should choose based on their problem you will retrieve workflows based on that description',
  ),
});

export const workflowsNode = async (state: typeof AgentState.State, config?: RunnableConfig) => {
  const result = await workflowAgent.invoke(state, config);
  const lastMessage = result.messages[result.messages.length - 1];
  return {
    messages: [new HumanMessage({ content: lastMessage.content, name: 'Researcher' })],
  };
};
