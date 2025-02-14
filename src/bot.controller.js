require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const constants = require('./constants');
const mongooseConnection = require("./connections/db");
const { 
  saveEventToDatabase, 
  setEventState, 
  addMembersToEvent, 
  getActiveEvent, 
  addPurchaseAmountToEvent, 
  calculateSharedAmount 
} = require('./bot.service'); 
require('dotenv').config();

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
mongooseConnection();
console.log("Telegram bot started!");

bot.onText(/\/start/, (msg) => {

  const chatId = msg.chat.id;
  const creator = msg.from.username || msg.from.first_name || `User_${chatId}`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Створити вечірку', callback_data: 'create_event' }]
      ]
    }
  };

  bot.sendMessage(chatId, 'Що ви хочете зробити?', options);
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
  
  



// bot.on('callback_query', async (callbackQuery) => {
//   const chatId = callbackQuery.message.chat.id;
//   const selectedOption = callbackQuery.data;
//   const creator = callbackQuery.from.username || callbackQuery.from.first_name || `User_${chatId}`;

//     bot.sendMessage(chatId, 'Введіть назву вечірки:')
//     if(selectedOption === 'create_event'){
//       bot.once('message', async (msg) => {
//         console.log(msg)
//           const result = await saveEventToDatabase(creator, eventName);
//           bot.sendMessage(chatId, result.message);
//           sendControlButtons(chatId, eventName);
//         })
//     }

//   }
  
//   if (selectedOption === 'deactivate') {
//     const result = await setEventState(creator);
//     bot.sendMessage(chatId, result.message);
//     return;
//   }

//   if (selectedOption === 'add_members') {
//     bot.sendMessage(chatId, 'Введіть користувачів, яких хочете додати до вечірки, через кому (user1, user2):');
//     bot.once('message', async (msg) => {
//       if (!msg.text) return;
      
//       const members = msg.text.split(',').map(user => user.trim());
//       const result = await addMembersToEvent(creator, members);
//       bot.sendMessage(chatId, result.message);
  
//       bot.sendMessage(chatId, 'Введіть суму покупки:');
//       bot.once('message', async (msg) => {
//         const amount = parseFloat(msg.text);
//         if (isNaN(amount) || amount <= 0) {
//           bot.sendMessage(chatId, 'Будь ласка, введіть коректну суму.');
//           return;
//         }
//         const amountResult = await addPurchaseAmountToEvent(creator, amount);
//         bot.sendMessage(chatId, amountResult.message);
//       });
//     });
//     return;
//   }
// });




// bot.onText(/\/calculate_amount/, async (msg) => {
//   const chatId = msg.chat.id;
//   const creator = msg.from.username || msg.from.first_name || `User_${chatId}`;
//   const result = await calculateSharedAmount(creator);
//   bot.sendMessage(chatId, result.message);
// });

// function sendControlButtons(chatId, eventName) {
//   const options = {
//     reply_markup: {
//       inline_keyboard: [
//         [{ text: 'Додати учасників', callback_data: 'add_members' }],
//         [{ text: 'Деактивувати вечірку', callback_data: 'deactivate' }]
//       ]
//     }
//   };
//   bot.sendMessage(chatId, `Ваша активна вечірка: ${eventName}`, options);
// }

// function waitForMessage(chatId) {
//     return new Promise((resolve) => {
//       bot.on('message', function handler(msg) {
//         if (msg.chat.id === chatId && msg.text) {
//           bot.removeListener('message', handler); // Видаляємо обробник після отримання повідомлення
//           resolve(msg.text);
//         }
//       });
//     });
//   }