import readline from 'readline';
import { HumanMessage } from '@langchain/core/messages';
import graph from './Graph';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let conversationState: { messages: HumanMessage[] } = { messages: [] };

const askUser = () => {
  rl.question('You: ', async (userInput) => {
    if (userInput.toLowerCase() === 'exit') {
      console.log('Exiting chat.');
      rl.close();
      return;
    }

    // Append user message to history
    conversationState.messages.push(new HumanMessage(userInput));

    // Invoke LangGraph
    const result = await graph.invoke(conversationState);

    // Extract bot response
    const lastMessage = result.messages[result.messages.length - 1];
    console.log(`Bot: ${lastMessage.content}`);

    // Update state
    conversationState = result;

    // Ask for next message
    askUser();
  });
};

console.log("Chat started. Type 'exit' to end.");
askUser();
