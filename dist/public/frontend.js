document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.Telegram === 'undefined') {
        console.error('Telegram WebApp API недоступен.');
    } else {
        console.log('Telegram WebApp API доступен');
        window.Telegram.WebApp.ready();

        // Функция для получения Telegram ID пользователя
        function getTelegramUserId() {
            const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
            return user ? user.id : null;
        }

        // Получаем значение referredBy
        let referredBy = null;

        // Сначала пытаемся получить его из initData
        const initDataParams = new URLSearchParams(window.Telegram.WebApp.initData);
        if (initDataParams.has('startapp') || initDataParams.has('startApp')) {
            referredBy = initDataParams.get('startapp') || initDataParams.get('startApp');
            console.log(`Параметр referredBy получен из initData: ${referredBy}`);
        } 

        // Если initData не содержит параметр, пробуем получить его из URL браузера
        if (!referredBy) {
            const urlParams = new URLSearchParams(window.location.search);
            referredBy = urlParams.get('referredBy');
            console.log(`Параметр referredBy получен из URL браузера: ${referredBy}`);
        }

        const telegramId = getTelegramUserId();

        if (!telegramId) {
            console.error('Telegram ID не доступен.');
            return;
        }

        // Обработка кнопки "Meet Friends"
        const meetFriendsButton = document.getElementById('meetFriendsButton');
        if (meetFriendsButton) {
            meetFriendsButton.addEventListener('click', () => {
                fetch(`/generate?telegramId=${telegramId}&referredBy=${referredBy || ''}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Ошибка в запросе к /generate');
                        return response.json();
                    })
                    .then(data => {
                        if (data.referralLink) {
                            console.log(`Сгенерированная реферальная ссылка: ${data.referralLink}`);
                            const message = `Привет! Вот моя реферальная ссылка: ${data.referralLink}`;
                            window.open(`https://t.me/share/url?url=${encodeURIComponent(data.referralLink)}&text=${encodeURIComponent(message)}`, '_blank');
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

        // Обработка кнопки "Friend's List"
        const friendsListButton = document.getElementById('friendsListButton');
        if (friendsListButton) {
            friendsListButton.addEventListener('click', () => {
                fetch(`/friends-list?telegramId=${telegramId}`)
                    .then(response => response.json())
                    .then(data => {
                        const friendsListDiv = document.getElementById('friendsList');
                        friendsListDiv.innerHTML = '';

                        if (data.friends && data.friends.length > 0) {
                            data.friends.forEach(friend => {
                                const friendItem = document.createElement('div');
                                friendItem.textContent = `ID друга: ${friend}`;
                                friendsListDiv.appendChild(friendItem);
                            });
                        } else {
                            friendsListDiv.innerHTML = 'Друзья не найдены.';
                        }
                        friendsListDiv.style.display = 'block';
                    })
                    .catch(error => console.error('Ошибка при получении списка друзей:', error));
            });
        } else {
            console.warn('Кнопка "Friend\'s List" не найдена.');
        }
    }
});













