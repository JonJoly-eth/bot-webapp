document.addEventListener('DOMContentLoaded'), () => {
    // Инициализация Telegram WebApp API
    if (typeof window.Telegram === 'undefined' || typeof window.Telegram.WebApp === 'undefined') {
        console.error('Telegram WebApp API is not available. Please run the app inside Telegram.');
        return;
    }
}
    const telegram = window.Telegram.WebApp;

    // Получаем ID пользователя через Telegram WebApp API
    const telegramId = telegram.initDataUnsafe?.user?.id;

    if (!telegramId) {
        console.error('Telegram ID is not available.');
        return;
    }

    document.getElementById('generateBtn').addEventListener('click', async () => {
        try {
            // Отправка запроса на сервер для генерации реферальной ссылки
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ telegramId }) // Передача telegramId в теле запроса
            });

            const data = await response.json();
            
            // Отображение сгенерированной ссылки
            if (data.referralLink) {
                window.open(data.referralLink, '_blank'); // Открытие ссылки в новом окне
            } else {
                alert(`Error: ${data.error}`); // Сообщение об ошибке
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

