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
const botName = 'invtfrds_bot'; // Имя бота
const users = [];
// Отправка frontend страницы
app.get('/', (req, res) => {
    console.log('Запрос на главную страницу');
    res.sendFile(path_1.default.join(__dirname, 'public', 'frontend.html'));
});
// Генерация реферальной ссылки на основе Telegram ID
app.get('/generate', async (req, res) => {
    const telegramId = String(req.query.telegramId || '').trim();
    const referredBy = req.query.referredBy ? String(req.query.referredBy).trim() : undefined;
    if (!telegramId) {
        console.error('Ошибка: Telegram ID обязателен');
        return res.status(400).json({ error: 'Telegram ID is required' });
    }
    const existingUser = users.find(user => user.telegramId === telegramId);
    const referralLink = `https://t.me/${botName}?start=${telegramId}`;
    if (existingUser) {
        console.log(`Пользователь с Telegram ID ${telegramId} уже существует. Возвращаем его реферальную ссылку.`);
    }
    else {
        console.log(`Добавляется новый пользователь с Telegram ID ${telegramId} и пригласившим: ${referredBy || 'отсутствует'}`);
        users.push({ telegramId, referredBy });
    }
    console.log('Текущий список пользователей:', JSON.stringify(users, null, 2));
    return res.json({ referralLink });
});
// Новый маршрут для проверки массива users в консоли
app.get('/check-users', (req, res) => {
    console.log('Содержимое массива users:', JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'Check console for users array' });
});
// Новый маршрут для получения списка друзей
app.get('/friends-list', (req, res) => {
    const telegramId = String(req.query.telegramId || '').trim();
    if (!telegramId) {
        console.error('Ошибка: Telegram ID обязателен');
        return res.status(400).json({ error: 'Telegram ID is required' });
    }
    console.log(`Получен запрос на получение списка друзей для Telegram ID: ${telegramId}`);
    const friends = users.filter(user => user.referredBy === telegramId);
    if (friends.length > 0) {
        console.log(`Найдено ${friends.length} друзей для пользователя с ID ${telegramId}`);
        return res.json({ friends: friends.map(user => user.telegramId) });
    }
    else {
        console.warn(`Список друзей пуст для Telegram ID ${telegramId}`);
        return res.status(404).json({ message: 'Список друзей пуст или не найден.' });
    }
});
// Обработка приглашения друзей
app.post('/invite', (req, res) => {
    const telegramId = req.body.telegramId?.toString().trim();
    if (!telegramId) {
        console.error('Ошибка: Telegram ID обязателен для приглашения');
        return res.status(400).json({ error: 'Telegram ID is required' });
    }
    const referralLink = `https://t.me/${botName}?start=${telegramId}`;
    const message = `Привет! Вот моя реферальная ссылка: ${referralLink}`;
    const inviteLink = `https://t.me/${botName}?start=${telegramId}&msg=${encodeURIComponent(message)}`;
    console.log(`Сформирована ссылка приглашения для Telegram ID ${telegramId}: ${inviteLink}`);
    return res.json({ inviteLink });
});
// Запуск веб-сервера
app.listen(5000, () => {
    console.log('Сервер запущен на http://localhost:5000');
});
