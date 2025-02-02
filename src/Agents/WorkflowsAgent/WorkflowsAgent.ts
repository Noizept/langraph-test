import { RunnableConfig } from '@langchain/core/runnables';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getWorkflowByDescription } from './WorkflowsAgentTools';
import { ChatOpenAI } from '@langchain/openai';
import { AgentState } from '../../State/State';
import { END } from '@langchain/langgraph';

const llm = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  temperature: 0,
});

// Recall llm was defined as ChatOpenAI above
// It could be any other language model
const workflowAgent = createReactAgent({
  llm,
  tools: [],
  stateModifier: new SystemMessage(
    'You are a workflow agent retrieval specialist, every time a user asks for suggestion on what workflow' +
      'they should choose based on their problem you will retrieve workflows based on that description.' +
      'Only give ID, name,status, description, tags and who created it.' +
      'Try be direct as possible without much chatter.',
  ),
});

export const workflowsNode = async (state: typeof AgentState.State, config?: RunnableConfig) => {
  const result = await workflowAgent.invoke(state, config);
  const lastMessage = result.messages[result.messages.length - 1];
  return {
    messages: [
      new AIMessage({
        content: lastMessage.content,
        // Put the "Workflow" label in additional_kwargs if you want it for your logs
        additional_kwargs: { agentLabel: 'Workflow' },
      }),
    ],
    next: 'Supervisor',
  };
};
