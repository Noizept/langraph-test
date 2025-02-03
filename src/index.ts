import { Telegraf } from 'telegraf';
import { HumanMessage } from '@langchain/core/messages';
import graph from './Graph'; // Your compiled LangGraph

// Create the bot using your Telegram bot token
const bot = new Telegraf('8032229156:AAEwNTxCbxSiX29B04i9rMys2-6WsV5LeIg');

// We'll maintain conversation state per Telegram user (using their ID)
const conversationStates = new Map<number, { messages: HumanMessage[] }>();

// When the user starts the bot, initialize state
bot.start((ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  conversationStates.set(userId, { messages: [] });
  ctx.reply('Hello! How can I help you?');
});

// Listen for text messages
bot.on('text', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  // Retrieve or initialize the user's conversation state
  let conversationState = conversationStates.get(userId) || { messages: [] };

  // Optionally allow users to exit the conversation
  if (ctx.message.text.toLowerCase() === 'exit') {
    conversationStates.delete(userId);
    ctx.reply('Goodbye!');
    return;
  }

  // Append the user's message to the state
  conversationState.messages.push(new HumanMessage(ctx.message.text));

  // Invoke your LangGraph with the updated state
  try {
    const result = await graph.invoke(conversationState);
    const lastMessage = result.messages[result.messages.length - 1];

    // Update the conversation state for this user
    conversationStates.set(userId, result);

    // Reply with the bot's message
    ctx.reply(lastMessage.content as string);
  } catch (error) {
    console.error('Error processing message:', error);
    ctx.reply('Sorry, something went wrong.');
  }
});

// Launch the bot
bot.launch();

console.log('Telegram bot is running...');
