import { Bot, InlineKeyboard, Context } from "grammy";
import axios from 'axios';

// Расширяем тип Context для добавления свойства startPayload
interface CustomContext extends Context {
    startPayload?: string; // Добавляем startPayload, который будет хранить реферальный ID
}

// Создаем экземпляр бота
const bot = new Bot<CustomContext>("7643527810:AAENy1CTxgv7iCAnG11xewbXh0aLe3sG8-I");

// Настраиваем текст меню и кнопки
const menuText = "<b>Привет!</b>\n\nОткрывай приложение для приглашения друзей.";
const openAppButtonText = "Открыть приложение";

// Обработчик команды /start для отправки меню с кнопкой
bot.command('start', async (ctx) => {
    const referredBy = ctx.match; // Извлекаем startPayload

    console.log('Команда /start получена от пользователя:', ctx.from?.id);
    console.log('Реферальный ID:', referredBy || 'отсутствует');
    const webAppUrl = `https://b720-45-225-214-219.ngrok-free.app?referredBy=${referredBy}`;
    const menuMarkup = new InlineKeyboard().webApp(openAppButtonText, webAppUrl);
    await ctx.reply(menuText, {
        parse_mode: "HTML",
        reply_markup: menuMarkup,
    });
    console.log('Меню отправлено пользователю:', ctx.from?.id);
});

// Обработчик для запроса реферальной ссылки через callback_query
bot.on('callback_query:data', async (ctx) => {
    const telegramId = ctx.from?.id;

    if (telegramId) {
        try {
            // Запрашиваем реферальную ссылку с использованием telegramId и startPayload
            const response = await axios.get('http://localhost:5000/generate', {
                params: { telegramId, referredBy: ctx.startPayload },
            });

            const referralLink = response.data.referralLink;
            await ctx.answerCallbackQuery();
            await ctx.reply(`Ваша реферальная ссылка: ${referralLink}`);
            console.log('Сгенерированная реферальная ссылка для пользователя:', telegramId, referralLink);
        } catch (error) {
            console.error('Ошибка при создании реферальной ссылки:', error);
            await ctx.reply('Произошла ошибка при создании реферальной ссылки.');
        }
    } else {
        console.warn('Telegram ID пользователя не найден.');
        await ctx.reply('Не удалось получить ваш Telegram ID.');
    }
});

// Запускаем бота
bot.start();
console.log('Бот запущен и готов к работе.');








