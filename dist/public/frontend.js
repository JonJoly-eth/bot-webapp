document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.Telegram === 'undefined') {
      console.error('Telegram WebApp API недоступен.');
  } else {
      console.log('Telegram WebApp API доступен');

      // Инициализируем WebApp
      window.Telegram.WebApp.ready();
      console.log("initDataUnsafe: ", window.Telegram.WebApp.initDataUnsafe);

      // Получение Telegram ID
      function getTelegramUserId() {
          const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
          return user ? user.id : null;
      }

      // Обработка кнопки "Meet Friends"
      document.getElementById('meetFriendsButton').addEventListener('click', () => {
          const telegramId = getTelegramUserId();

          if (!telegramId) {
              console.error('Telegram ID не доступен.');
              return;
          }

          // Генерация реферальной ссылки
          fetch(`/generate?telegramId=${telegramId}`, {
              method: 'GET',
          })
          .then(response => response.json())
          .then(data => {
              if (data.referralLink) {
                  const message = `Привет! Вот моя реферальная ссылка: ${data.referralLink}`;
                  const encodedMessage = encodeURIComponent(message);
                  
                  // Формируем URL для отправки сообщения
                  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(data.referralLink)}&text=${encodedMessage}`;
                  
                  // Открытие ссылки на Telegram с сообщением
                  window.open(telegramUrl, '_blank');
              } else {
                  console.error(`Ошибка: ${data.error}`);
              }
          })
          .catch(error => {
              console.error('Ошибка:', error);
          });
      });

      // Обработка кнопки "Friend's List"
      // Обработка кнопки "Friend's List"
document.getElementById('friendsListButton').addEventListener('click', () => {
    const telegramId = getTelegramUserId();

    if (!telegramId) {
        console.error('Telegram ID не доступен.');
        return;
    }

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
        friendsListDiv.innerHTML = ''; // Очищаем предыдущий список

        if (data.friends && data.friends.length > 0) {
            data.friends.forEach(friend => {
                const friendItem = document.createElement('div');
                friendItem.textContent = friend.telegramId; // Здесь выводится Telegram ID
                friendsListDiv.appendChild(friendItem);
            });
        } else {
            friendsListDiv.innerHTML = 'Друзья не найдены.'; // Отображаем сообщение, если друзья не найдены
        }

        // Отображаем список друзей
        friendsListDiv.style.display = 'block';
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
});

  }
});


      














//document.addEventListener('DOMContentLoaded'), () => {
  //  document.addEventListener('DOMContentLoaded'), () => {
    //    console.log('WebApp инициализировано');
        // Инициализация Telegram WebApp API
      //  if (typeof window.Telegram === 'undefined' || typeof window.Telegram.WebApp === 'undefined') {
        //    console.error('Telegram WebApp API is not available. Please run the app inside Telegram.');
        //    return;
        //}
    //}
      //  const telegram = window.Telegram.WebApp;
       // console.log('Telegram WebApp API доступен.');
        // Получаем ID пользователя через Telegram WebApp API
       // const telegramId = telegram.initDataUnsafe?.user?.id;
        
        
        
        //if (!telegramId) {
          //  console.error('Telegram ID is not available.');
            //return;
       // }
        //console.log(`Telegram ID получен: ${telegramId}`);
    
        // Обработчик события нажатия кнопки "Сгенерировать ссылку"
        //document.getElementById('generateButton').addEventListener('click', async () => {
          //  try {
            //    console.log('Нажата кнопка "Generate Referral Link"');
    
                // Отправка запроса на сервер для генерации реферальной ссылки
              //  const response = await fetch(`/generate?telegramId=${telegramId}`, {
                //    method: 'GET',
      //          });
                
               // const data = await response.json();
                
                // Отображение сгенерированной ссылки
                //if (data.referralLink) {
                  //  console.log(`Ссылка сгенерирована: ${data.referralLink}`);
                   // window.open(data.referralLink, '_blank'); // Открытие ссылки в новом окне
               // } else {
                    //alert(`Ошибка: ${data.error}`);
               // }
           // } catch (error) {
             //   console.error('Ошибка:', error);
            //}
        //});
    
     
    //};
