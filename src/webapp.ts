import express, { Request, Response } from 'express'; 
import path from 'path'; 

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Изменяем структуру массива: используем поле telegramId вместо id
const users: { telegramId: string, referralLink: string }[] = [];

// Отправка frontend страницы
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'frontend.html'));
});

// Генерация реферальной ссылки на основе Telegram ID
app.post('/generate', (req: Request, res: Response) => {
    const telegramId = req.body.telegramId; // Получение ID пользователя из запроса

    if (!telegramId) {
        return res.status(400).json({ error: 'Telegram ID is required' });
    }

    const existingUser = users.find(user => user.telegramId === telegramId);
    
    if (existingUser) {
        // Если пользователь уже существует, возвращаем его реферальную ссылку
        return res.json({ referralLink: existingUser.referralLink });
    } else {
    }
        // получаем имя бота 
        const botName = 'invtfrds_bot';
        if (!botName) {
            return res.status(500).json({ error: 'Bot name is not set' });
        // Если это новый пользователь, создаём новую реферальную ссылку
        const referralLink = `https://t.me/${botName}?start=${telegramId}`;
        users.push({ telegramId, referralLink });
        return res.json({ referralLink });
    }
});

// Запуск веб-сервера
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});

