import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { AgentState } from '../State/State'; // Import your state definition
import { RunnableConfig } from '@langchain/core/runnables';
import { END } from '@langchain/langgraph';

const llm = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  temperature: 0,
});

// Supervisor Agent
const supervisorAgent = createReactAgent({
  llm,
  tools: [], // No tools needed for the supervisor
  stateModifier: new SystemMessage(
    `You are a supervisor agent. Respond with EXACTLY one word: "Workflow" or "Billing". ` +
      `Do NOT add extra text or punctuation. If you are unsure, respond with "END".`,
  ),
});

export const supervisorNode = async (state: typeof AgentState.State, config?: RunnableConfig) => {
  const lastMessage = state.messages[state.messages.length - 1];

  // Ensure we are only routing based on a USER message
  if (!(lastMessage instanceof HumanMessage)) {
    console.log('Skipping Supervisor processing because last message is not from a user.');
    return {
      ...state,
      next: END, // Or continue the workflow
    };
  }

  // Process the user message
  const result = await supervisorAgent.invoke(state, config);
  const lastResponse = result.messages[result.messages.length - 1];

  let agentName = lastResponse.content.toString().trim();

  console.log('Supervisor raw:', agentName);

  // Ensure valid routing
  if (agentName.toLowerCase().includes('billing')) {
    agentName = 'Billing';
  } else if (agentName.toLowerCase().includes('workflow')) {
    agentName = 'Workflow';
  } else {
    agentName = END; // End conversation if unknown
  }

  return {
    ...state,
    messages: [
      new HumanMessage({
        content: lastResponse.content,
        name: 'Supervisor',
      }),
    ],
    next: agentName,
  };
};
