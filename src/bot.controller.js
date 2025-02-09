require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const constants = require('./constants');
<<<<<<< HEAD
=======

const token = process.env.TOKEN;
>>>>>>> 26e1969 (Minor chages env related)
const mongooseConnection = require("./connections/db");
const { saveEventToDatabase,setEventState} = require('./bot.service'); 
require('dotenv').config();

console.log('TOKE ', process.env.TOKEN);

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
mongooseConnection();
console.log("Telegram bot started!");

bot.onText(/\/start/, (msg) => {

  const chatId = msg.chat.id;
  const options = {
    reply_markup: {
      inline_keyboard: Object.keys(constants).map(key => {
        return [{ text: constants[key], callback_data: key }];
      })
    }
  };
  bot.sendMessage(chatId, 'Як ви будете відпочивати?', options);
});

bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const selectedOption = callbackQuery.data;
    const creator = callbackQuery.from.username || callbackQuery.from.first_name || `User_${chatId}`;
    if(constants[selectedOption]){
        bot.sendMessage(chatId, `Ви вибрали: ${constants[selectedOption]}`);
    }
    const result = await saveEventToDatabase(constants[selectedOption], creator, chatId);
    
    if (!result.success) {
        const options = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Деактивувати активну вечірку', callback_data: 'deactivate' },
            ]
          ]
        }
      };
      bot.sendMessage(chatId, result.message,options);
    }
  });
  
  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    if (callbackQuery.data === 'deactivate') {
      const creator = callbackQuery.from.username || callbackQuery.from.first_name || `User_${chatId}`;
      const result = await setEventState(creator);
      if (result.success) {
        bot.sendMessage(chatId, result.message);
      } else {
        bot.sendMessage(chatId, result.message);
      }
    } 
  });
  
  bot.onText(/\/add_members/, async(msg) => {
    const namePrompt = await bot.sendMessage(msg.chat.id, "Any members here ?", {
      reply_markup: {
          force_reply: true,
      },
  });
  bot.onReplyToMessage(msg.chat.id, namePrompt.message_id, async (nameMsg) => {
      const name = nameMsg.text;
      await bot.sendMessage(msg.chat.id, `Hello ${name} beach`);
      await saveEventToDatabase(null,null,null, name);
  });


console.log('Message : ', msg.text)
  })
  
  



  