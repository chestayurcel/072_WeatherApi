document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const locationInput = document.getElementById('locationInput');
    
    // API Key Anda sudah dimasukkan
    const apiKey = "83e327711277c16695693aee4c949b39"; 

    const messageElement = document.getElementById('message');
    const resultElement = document.getElementById('result');

    const searchWeather = async () => {
        const location = locationInput.value.trim();
        if (location === "") {
            showMessage("Nama lokasi tidak boleh kosong.");
            return;
        }

        if (apiKey === "YOUR_API_KEY") {
            showMessage("Harap masukkan API Key Anda di file script.js.");
            return;
        }

        showMessage("Mencari data...");
        hideResult();

        try {
            // 1. Dapatkan Latitude & Longitude dari nama lokasi (Geocoding)
            const geoResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric&lang=id`);
            
            if (!geoResponse.ok) {
                if (geoResponse.status === 404) {
                    throw new Error("Lokasi tidak ditemukan. Coba nama kota yang lebih umum.");
                } else {
                    throw new Error("Gagal mengambil data geolokasi.");
                }
            }
            
            const geoData = await geoResponse.json();
            const { lat, lon } = geoData.coord;
            const country = geoData.sys.country;
            const temp = geoData.main.temp;
            const humidity = geoData.main.humidity;

            // 2. Dapatkan detail alamat (termasuk provinsi) dari Latitude & Longitude (Reverse Geocoding)
            const reverseGeoResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`);
            if (!reverseGeoResponse.ok) {
                throw new Error("Gagal mengambil detail lokasi.");
            }
            const reverseGeoData = await reverseGeoResponse.json();
            
            // Tampilkan hasil
            displayWeather(geoData.name, country, reverseGeoData.name, temp, humidity, lat, lon);

        } catch (error) {
            showMessage(error.message);
        }
    };

    const displayWeather = (locationName, country, province, temp, humidity, lat, lon) => {
        document.getElementById('lokasi').textContent = locationName;
        document.getElementById('negara').textContent = country;
        document.getElementById('provinsi').textContent = province || 'Tidak tersedia'; // 'state' biasanya berisi provinsi
        document.getElementById('suhu').textContent = `${temp} °C`;
        document.getElementById('kelembaban').textContent = `${humidity} %`;
        document.getElementById('latitude').textContent = lat;
        document.getElementById('longitude').textContent = lon;
        
        showResult();
    };

    const showMessage = (msg) => {
        messageElement.textContent = msg;
        messageElement.classList.remove('hidden');
    };

    const hideResult = () => {
        resultElement.classList.add('hidden');
    };
    
    const showResult = () => {
        messageElement.classList.add('hidden');
        resultElement.classList.remove('hidden');
    };

    searchButton.addEventListener('click', searchWeather);
    locationInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchWeather();
        }
    });
});