import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Массив для хранения данных пользователей
interface User {
    telegramId: string;
    referredBy?: string; // Поле для хранения ID пользователя, который пригласил
}

const botName = 'invtfrds_bot'; // Имя бота
const users: User[] = [];

// Отправка frontend страницы
app.get('/', (req: Request, res: Response) => {
    console.log('Запрос на главную страницу');
    res.sendFile(path.join(__dirname, 'public', 'frontend.html'));
});

// Генерация реферальной ссылки на основе Telegram ID
app.get('/generate', async (req: Request, res: Response) => {
    try {
        const telegramId: string = String(req.query.telegramId); // Получаем Telegram ID из запроса
        const referredBy: string | undefined = req.query.referredBy ? String(req.query.referredBy) : undefined; // Получаем реферальный ID

        console.log(`Получен запрос на генерацию реферальной ссылки для Telegram ID: ${telegramId}, пригласивший: ${referredBy || 'отсутствует'}`);

        if (!telegramId) {
            console.error('Ошибка: Telegram ID обязателен');
            return res.status(400).json({ error: 'Telegram ID is required' });
        }

        const existingUser = users.find(user => user.telegramId === telegramId);
        let referralLink = `https://t.me/${botName}?start=${telegramId}`;
        
        if (existingUser) {
            // Если пользователь уже существует, возвращаем его реферальную ссылку
            console.log(`Пользователь с Telegram ID ${telegramId} уже существует. Возвращаем его реферальную ссылку.`);
        } else {
            // Добавляем нового пользователя, если его нет в системе
            console.log(`Добавляется новый пользователь с Telegram ID ${telegramId} и пригласившим: ${referredBy || 'отсутствует'}`);
            users.push({ telegramId, referredBy });
        }

        console.log('Текущий список пользователей:', JSON.stringify(users, null, 2));
        return res.json({ referralLink });
    } catch (error) {
        console.error('Ошибка в обработке запроса /generate:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Новый маршрут для проверки массива users в консоли
app.get('/check-users', (req: Request, res: Response) => {
    console.log('Содержимое массива users:', JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'Check console for users array' });
});

// Новый маршрут для получения списка друзей
app.get('/friends-list', (req: Request, res: Response) => {
    try {
        const telegramId = String(req.query.telegramId); // Получаем Telegram ID из запроса
        console.log(`Получен запрос на получение списка друзей для Telegram ID: ${telegramId}`);
        
        // Находим пользователей, которые были приглашены данным пользователем
        const friends = users.filter(user => user.referredBy === telegramId);
        console.log(`Найдено ${friends.length} друзей для пользователя с ID ${telegramId}`);

        if (friends.length > 0) {
            const friendList = friends.map(user => user.telegramId);
            return res.json({ friends: friendList });
        } else {
            console.warn(`Список друзей пуст для Telegram ID ${telegramId}`);
            return res.status(404).json({ message: 'Список друзей пуст или не найден.' });
        }
    } catch (error) {
        console.error('Ошибка в обработке запроса /friends-list:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Обработка приглашения друзей
app.post('/invite', (req: Request, res: Response) => {
    try {
        const telegramId = req.body.telegramId;

        if (!telegramId) {
            console.error('Ошибка: Telegram ID обязателен для приглашения');
            return res.status(400).json({ error: 'Telegram ID is required' });
        }

        const referralLink = `https://t.me/${botName}?start=${telegramId}`;
        const message = `Привет! Вот моя реферальная ссылка: ${referralLink}`;
        const inviteLink = `https://t.me/${botName}?start=${telegramId}&msg=${encodeURIComponent(message)}`;

        console.log(`Сформирована ссылка приглашения для Telegram ID ${telegramId}: ${inviteLink}`);
        return res.json({ inviteLink });
    } catch (error) {
        console.error('Ошибка в обработке запроса /invite:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Запуск веб-сервера
app.listen(5000, () => {
    console.log('Сервер запущен на http://localhost:5000');
});


