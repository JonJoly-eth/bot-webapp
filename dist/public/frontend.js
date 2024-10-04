// Действие при нажатии кнопки "Invite Friends"
document.getElementById('generateBtn').addEventListener('click', async () => {
    try {
        // Отправка запроса на сервер для генерации реферальной ссылки
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        // Отображение сгенерированной ссылки
        document.getElementById('referralLink').textContent = `Your referral link: ${data.referralLink}`;
    } catch (error) {
        console.error('Error:', error);
    }
});

