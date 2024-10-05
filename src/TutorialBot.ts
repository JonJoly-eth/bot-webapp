import { Bot, InlineKeyboard, Context } from "grammy";
import axios from 'axios';

interface UserSession {
  referrer?: string; // Реферал (если есть)
}
//Store bot screaming status
let screaming = false;

//Create a new bot
const bot = new Bot("7643527810:AAENy1CTxgv7iCAnG11xewbXh0aLe3sG8-I");

//Pre-assign menu text
const singleMenu = "<b>Menu 1</b>\n\nA beautiful menu with a shiny inline button.";

//Pre-assign button text
const openButton = "OpenAPP";
const referralButton= "Получить реферальную ссылку"

//Build keyboards
const singleMenuMarkup = new InlineKeyboard().webApp(openButton, 'https://c333-45-225-214-219.ngrok-free.app').text(referralButton, 'get_referral');

// Обработчик команды /start, сразу показывающий меню
bot.command('start', async (ctx: Context) => {
  await ctx.reply(singleMenu, {
    parse_mode: "HTML",
    reply_markup: singleMenuMarkup,
  });
});

// Обработчик для нажатия на кнопку реферальной ссылки
bot.callbackQuery('get_referral', async (ctx) => {
  const userId = ctx.from?.id;

  if (userId) {
    try {
      // Отправляем POST-запрос на сервер с Telegram ID
      const response = await axios.post('http://localhost:5000/generate', {
        telegramId: userId
      });

      // Получаем реферальную ссылку из ответа сервера
      const referralLink = response.data.referralLink;

      await ctx.reply(`Ваша реферальная ссылка: ${referralLink}`);
    } catch (error) {
      await ctx.reply('Произошла ошибка при создании реферальной ссылки.');
    }
  } else {
    await ctx.reply('Не удалось получить ваш Telegram ID.');
  }
});//Start the Bot
bot.start();


