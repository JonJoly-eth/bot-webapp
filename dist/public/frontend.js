document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.Telegram === 'undefined') {
        console.error('Telegram WebApp API недоступен.');
    } else {
        console.log('Telegram WebApp API доступен');

        // Инициализируем WebApp
        window.Telegram.WebApp.ready();

        // Функция для получения Telegram ID пользователя
        function getTelegramUserId() {
            const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
            if (!user) {
                console.warn('Пользовательские данные не получены из initDataUnsafe.');
            }
            return user ? user.id : null;
        }

        // Получаем значение referredBy из URL
        const urlParams = new URLSearchParams(window.location.search);
        const referredBy = urlParams.get('start'); // Пустая строка, если referredBy отсутствует
        console.log(`Параметр referredBy из URL: ${referredBy}`);

        // Обработка кнопки "Meet Friends" для генерации реферальной ссылки
        const meetFriendsButton = document.getElementById('meetFriendsButton');
        if (meetFriendsButton) {
            meetFriendsButton.addEventListener('click', () => {
                const telegramId = getTelegramUserId();

                if (!telegramId) {
                    console.error('Telegram ID не доступен.');
                    return;
                }

                console.log(`Запрос на генерацию реферальной ссылки для Telegram ID: ${telegramId} и referredBy: ${referredBy}`);

                // Запрос на генерацию реферальной ссылки с telegramId и referredBy
                fetch(`/generate?telegramId=${telegramId}&referredBy=${referredBy || ''}`, {
                    method: 'GET',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка в запросе к /generate');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.referralLink) {
                        console.log(`Сгенерированная реферальная ссылка: ${data.referralLink}`);
                        const message = `Привет! Вот моя реферальная ссылка: ${data.referralLink}`;
                        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(data.referralLink)}&text=${encodeURIComponent(message)}`;
                        
                        // Открытие ссылки для отправки сообщения в Telegram
                        window.open(telegramUrl, '_blank');
                    } else {
                        console.error(`Ошибка: ${data.error}`);
                    }
                })
                .catch(error => {
                    console.error('Ошибка при генерации реферальной ссылки:', error);
                });
            });
        } else {
            console.warn('Кнопка "Meet Friends" не найдена.');
        }

        // Обработка кнопки "Friend's List" для получения списка друзей
        const friendsListButton = document.getElementById('friendsListButton');
        if (friendsListButton) {
            friendsListButton.addEventListener('click', () => {
                const telegramId = getTelegramUserId();

                if (!telegramId) {
                    console.error('Telegram ID не доступен.');
                    return;
                }

                console.log(`Запрос на получение списка друзей для Telegram ID: ${telegramId}`);

                // Запрос на получение списка друзей
                fetch(`/friends-list?telegramId=${telegramId}`, {
                    method: 'GET',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка в запросе к /friends-list');
                    }
                    return response.json();
                })
                .then(data => {
                    const friendsListDiv = document.getElementById('friendsList');
                    friendsListDiv.innerHTML = ''; // Очистка перед добавлением списка друзей

                    if (data.friends && data.friends.length > 0) {
                        console.log(`Найдено ${data.friends.length} друзей.`);
                        data.friends.forEach(friend => {
                            const friendItem = document.createElement('div');
                            friendItem.textContent = `ID друга: ${friend}`;
                            friendsListDiv.appendChild(friendItem);
                        });
                    } else {
                        console.log('Список друзей пуст.');
                        friendsListDiv.innerHTML = 'Друзья не найдены.';
                    }

                    friendsListDiv.style.display = 'block';
                })
                .catch(error => {
                    console.error('Ошибка при получении списка друзей:', error);
                });
            });
        } else {
            console.warn('Кнопка "Friend\'s List" не найдена.');
        }
    }
});




      














