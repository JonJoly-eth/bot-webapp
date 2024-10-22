"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const users = [];
// Отправка frontend страницы
app.get('/', (req, res) => {
    console.log('Запрос на главную страницу');
    res.sendFile(path_1.default.join(__dirname, 'public', 'frontend.html'));
});
// Генерация реферальной ссылки на основе Telegram ID
app.get('/generate', async (req, res) => {
    try {
        const telegramId = String(req.query.telegramId); // Получение ID пользователя из запроса
        console.log(`Получен запрос на генерацию реферальной ссылки для Telegram ID: ${telegramId}`); // Логирование Telegram ID
        if (!telegramId) {
            console.error('Ошибка: Telegram ID is required');
            return res.status(400).json({ error: 'Telegram ID is required' });
        }
        const existingUser = users.find(user => user.telegramId === telegramId);
        let referralLink;
        if (existingUser) {
            // Если пользователь уже существует, возвращаем его реферальную ссылку
            console.log(`Пользователь с Telegram ID ${telegramId} уже существует. Возвращаем его реферальную ссылку.`); // Логирование существующего пользователя
            referralLink = existingUser.referralLink;
        }
        else {
            // получаем имя бота 
            const botName = 'invtfrds_bot';
            // Если это новый пользователь, создаём новую реферальную ссылку
            referralLink = `https://t.me/${botName}?start=${telegramId}`;
            users.push({ telegramId, referralLink });
            console.log(`Создана новая реферальная ссылка для Telegram ID ${telegramId}: ${referralLink}`); // Логирование новой ссылки
        }
        return res.json({ referralLink });
    }
    catch (error) {
        console.error('Ошибка в обработке запроса /generate:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Новый маршрут для получения списка друзей
app.get('/friends-list', (req, res) => {
    const telegramId = String(req.query.telegramId); // Получение ID пользователя из запроса
    console.log(`Получен запрос на получение списка друзей для Telegram ID: ${telegramId}`);
    // Находим пользователей, которые были приглашены данным пользователем
    const friends = users.filter(user => user.referredBy === telegramId);
    // Отправляем список пользователей
    return res.json({ friends });
});
// Обработка приглашения друзей
app.post('/invite', (req, res) => {
    const telegramId = req.body.telegramId;
    const referralLink = users.find(user => user.telegramId === telegramId)?.referralLink;
    if (!referralLink) {
        return res.status(404).json({ error: 'Referral link not found' });
    }
    const botName = 'invtfrds_bot';
    const message = `Привет! Вот моя реферальная ссылка: ${referralLink}`;
    const inviteLink = `https://t.me/${botName}?start=${telegramId}&msg=${encodeURIComponent(message)}`;
    return res.json({ inviteLink });
});
// Запуск веб-сервера
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
