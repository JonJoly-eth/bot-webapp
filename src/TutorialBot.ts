import { Bot, InlineKeyboard, Context } from "grammy";
import axios from 'axios';

interface UserSession {
  referrer?: string; // Реферал (если есть)
}
//Store bot screaming status
let screaming = false;

//Create a new bot
const bot = new Bot("7643527810:AAENy1CTxgv7iCAnG11xewbXh0aLe3sG8-I");

// Обработчик команды /start, поддерживающий deep linking
bot.command('start', async (ctx: Context) => {
  const text = ctx.message?.text || ''; // Получаем текст команды
  const params = text.split(' '); // Разделяем текст на части по пробелам

  if (params.length > 1) {
    const referrerId = parseInt(params[1]); // Получаем реферальный параметр (если есть)
    if (!isNaN(referrerId)) {
      await ctx.reply(`Вы были приглашены пользователем с ID: ${referrerId}`);
      // Здесь можно сохранить информацию о реферале в базе данных
    } else {
      await ctx.reply('Недействительный реферальный параметр.');
    }
  } else {
    await ctx.reply('Добро пожаловать! Используйте реферальную ссылку для получения бонусов.');
  }
});

//This function handles the /scream command
bot.command("scream", () => {
   screaming = true;
 });

//This function handles /whisper command
bot.command("whisper", () => {
   screaming = false;
 });

//Pre-assign menu text
const firstMenu = "<b>Menu 1</b>\n\nA beautiful menu with a shiny inline button.";
const secondMenu = "<b>Menu 2</b>\n\nA better menu with even more shiny inline buttons.";

//Pre-assign button text
const nextButton = "Next";
const backButton = "Back";
const openButton = "OpenAPP";
const referralButton= "Получить реферальную ссылку"


//Build keyboards
const firstMenuMarkup = new InlineKeyboard().text(nextButton, nextButton);
 
const secondMenuMarkup = new InlineKeyboard().text(backButton, backButton).webApp(openButton, "https://93fd-45-225-214-219.ngrok-free.app").text(referralButton, "get_referral");


//This handler sends a menu with the inline buttons we pre-assigned above
bot.command("menu", async (ctx) => {
  await ctx.reply(firstMenu, {
    parse_mode: "HTML",
    reply_markup: firstMenuMarkup,
  });
});

//This handler processes back button on the menu
bot.callbackQuery(backButton, async (ctx) => {
  //Update message content with corresponding menu section
  await ctx.editMessageText(firstMenu, {
    reply_markup: firstMenuMarkup,
    parse_mode: "HTML",
   });
 });

//This handler processes next button on the menu
bot.callbackQuery(nextButton, async (ctx) => {
  //Update message content with corresponding menu section
  await ctx.editMessageText(secondMenu, {
    reply_markup: secondMenuMarkup,
    parse_mode: "HTML",
   });
 });
// Обработчик для нажатия на кнопку реферальной ссылки
bot.command('referral', async (ctx: Context) => {
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
});


//This function would be added to the dispatcher as a handler for messages coming from the Bot API
bot.on("message", async (ctx) => {
  //Print to console
  console.log(
    `${ctx.from.first_name} wrote ${
      "text" in ctx.message ? ctx.message.text : ""
    }`,
  );

  if (screaming && ctx.message.text) {
    //Scream the message
    await ctx.reply(ctx.message.text.toUpperCase(), {
      entities: ctx.message.entities,
    });
  } else {
    //This is equivalent to forwarding, without the sender's name
    await ctx.copyMessage(ctx.message.chat.id);
  }
});

//Start the Bot
bot.start();
