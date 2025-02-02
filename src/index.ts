import { ChatOpenAI } from '@langchain/openai';
import { MemorySaver } from '@langchain/langgraph';
import { HumanMessage } from '@langchain/core/messages';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

// Define the tools for the agent to use
const agentModel = new ChatOpenAI({ temperature: 0 });

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: [],
  checkpointSaver: agentCheckpointer,
});

const a = async () => {
  // Now it's time to use!
  const agentFinalState = await agent.invoke(
    { messages: [new HumanMessage('what is the current weather in sf')] },
    { configurable: { thread_id: '42' } },
  );

  console.log(agentFinalState.messages[agentFinalState.messages.length - 1].content);

  const agentNextState = await agent.invoke(
    { messages: [new HumanMessage('what about ny')] },
    { configurable: { thread_id: '42' } },
  );

  console.log(agentNextState.messages[agentNextState.messages.length - 1].content);
};

a().then(() => {
  console.log('finished');
});
