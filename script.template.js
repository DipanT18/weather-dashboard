// ⚠️ IMPORTANT: Replace with YOUR actual API key
        const API_KEY = 'YOUR_API_KEY_HERE';
        const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

        // DOM Elements
        const cityInput = document.getElementById('cityInput');
        const searchBtn = document.getElementById('searchBtn');
        const weatherCard = document.getElementById('weatherCard');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const cityChips = document.querySelectorAll('.city-chip');

        // Weather icon mapping
        const weatherIcons = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };

        // Fetch weather data
        async function getWeather(city) {
            try {
                showLoading();
                hideError();
                
                const response = await fetch(
                    `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
                );
                
                if (!response.ok) {
                    throw new Error('City not found');
                }
                
                const data = await response.json();
                displayWeather(data);
                
            } catch (err) {
                showError(err.message === 'City not found' 
                    ? '❌ City not found. Please try another city.' 
                    : '❌ Something went wrong. Please check your API key and try again.');
            } finally {
                hideLoading();
            }
        }

        // Display weather data
        function displayWeather(data) {
            const iconCode = data.weather[0].icon;
            const icon = weatherIcons[iconCode] || '🌤️';
            
            document.getElementById('weatherIcon').textContent = icon;
            document.getElementById('weatherDescription').textContent = data.weather[0].description;
            document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById('feelsLike').textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
            document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
            document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
            
            weatherCard.classList.add('show');
        }

        // UI Helper functions
        function showLoading() {
            loading.classList.add('show');
            weatherCard.classList.remove('show');
        }

        function hideLoading() {
            loading.classList.remove('show');
        }

        function showError(message) {
            error.textContent = message;
            error.classList.add('show');
            weatherCard.classList.remove('show');
        }

        function hideError() {
            error.classList.remove('show');
        }

        // Event Listeners
        searchBtn.addEventListener('click', () => {
            const city = cityInput.value.trim();
            if (city) {
                getWeather(city);
            } else {
                showError('⚠️ Please enter a city name');
            }
        });

        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });

        cityChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const city = chip.getAttribute('data-city');
                cityInput.value = city;
                getWeather(city);
            });
        });

        // Load default city on page load
        window.addEventListener('load', () => {
            getWeather('Kathmandu');
        });