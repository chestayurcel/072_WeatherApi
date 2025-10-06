$(document).ready(function() {
    const apiKey = "10b97284bb6c42e5bdf11006250610";
    const weatherDisplay = $("#weather-display");
    const errorMessage = $("#error-message");

    function fetchWeather(location) {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

        $.ajax({
            url: url,
            method: "GET",
            success: function(data) {
                errorMessage.hide();
                weatherDisplay.show();

                $("#location-name").text(`${data.location.name}, ${data.location.country}`);
                $("#lat-lon").text(`Lat: ${data.location.lat}, Lon: ${data.location.lon}`);
                $("#weather-icon").attr("src", `https:${data.current.condition.icon}`);
                $("#condition").html(`<strong>Kondisi:</strong> ${data.current.condition.text}`);
                $("#temperature").html(`<strong>Suhu:</strong> ${data.current.temp_c}°C`);
                $("#humidity").html(`<strong>Kelembapan:</strong> ${data.current.humidity}%`);
                $("#wind-speed").html(`<strong>Angin:</strong> ${data.current.wind_kph} kph`);
            },
            error: function(error) {
                console.error("Error fetching weather data:", error);
                weatherDisplay.hide();
                errorMessage.show();
            }
        });
    }

    $("#search-button").on("click", function() {
        const location = $("#location-input").val();
        if (location) {
            fetchWeather(location);
        }
    });

    $("#location-input").on("keypress", function(event) {
        if (event.key === "Enter") {
            $("#search-button").click();
        }
    });
    
    // Memuat cuaca default saat halaman pertama kali dibuka
    fetchWeather("Yogyakarta");
});