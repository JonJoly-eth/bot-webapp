document.getElementById('generateButton').addEventListener('click', () => {
  const telegramId = getTelegramUserId(); // Получаем Telegram ID

  if (!telegramId) {
      return; // Если ID не доступен, прекращаем выполнение
  }

  fetch(`/generate?telegramId=${telegramId}`, {
      method: 'GET',
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`Ошибка сервера: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      if (data.referralLink) {
          document.getElementById('referralLink').innerHTML = `Сгенерированная реферальная ссылка: <a href="${data.referralLink}" target="_blank">${data.referralLink}</a>`;
      } else {
          console.error(`Ошибка: ${data.error}`);
      }
  })
  .catch(error => {
      console.error('Ошибка:', error);
  });
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