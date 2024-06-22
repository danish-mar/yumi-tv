document.addEventListener('DOMContentLoaded', () => {
    const weatherEmoji = document.getElementById('weather-emoji');
    const temperatureElement = document.getElementById('temperature');
    const highTempNotification = document.getElementById('high-temp-notification');

    const apiKey = '2a4402aa1ac0d5f03bd22086fb0660d2'; // Replace with your OpenWeatherMap API key
    const city = 'Aurangabad';
    const state = 'Maharashtra';
    const country = 'IN';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&units=metric&appid=${apiKey}`;

    // Fetch weather data initially and then every 30 minutes
    fetchWeatherData();
    setInterval(fetchWeatherData, 30 * 60 * 1000); // Update weather every 30 minutes

    function fetchWeatherData() {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temperature = Math.round(data.main.temp);
                const weather = data.weather[0].main.toLowerCase();

                temperatureElement.textContent = `${temperature}°C`;

                switch (weather) {
                    case 'clear':
                        weatherEmoji.textContent = '☀️';
                        break;
                    case 'clouds':
                        weatherEmoji.textContent = '☁️';
                        break;
                    case 'rain':
                        weatherEmoji.textContent = '🌧️';
                        break;
                    case 'thunderstorm':
                        weatherEmoji.textContent = '⛈️';
                        break;
                    case 'snow':
                        weatherEmoji.textContent = '❄️';
                        break;
                    case 'mist':
                    case 'fog':
                        weatherEmoji.textContent = '🌫️';
                        break;
                    default:
                        weatherEmoji.textContent = '🌡️';
                }

                // Check if temperature is above 20°C and display high temp notification if true
                if (temperature > 30) {
                    showNotification();
                } else {
                    hideNotification();
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                weatherEmoji.textContent = '❓';
                temperatureElement.textContent = '--°C';
            });
    }

    function showNotification() {
        highTempNotification.style.display = 'block';
        highTempNotification.classList.remove('fadeOut'); // Ensure fadeOut class is removed
        highTempNotification.classList.add('fadeIn'); // Add fadeIn class to trigger animation
    }

    function hideNotification() {
        highTempNotification.classList.remove('fadeIn'); // Remove fadeIn class
        highTempNotification.classList.add('fadeOut'); // Add fadeOut class to trigger animation

        // Hide the notification after animation completes
        setTimeout(() => {
            highTempNotification.style.display = 'none';
        }, 2000); // Adjust time to match animation duration
    }
});
