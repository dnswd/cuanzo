const TelegramBot = require('node-telegram-bot-api'); 
const bot = new TelegramBot(process.env.TELEGRAM, {polling: true});

bot.onCommand = (command, callback) => {
  bot.onText(
    new RegExp(`\/${command} (.+)`), 
    (message, regex) => callback(message, regex))
}

module.exports = bot;
