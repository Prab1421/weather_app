const userLocation = document.getElementById("userlocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelsLike = document.querySelector(".feelsLike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),
    Hvalue = document.getElementById("Hvalue"),
    Wvalue = document.getElementById("Wvalue"),
    SRvalue = document.getElementById("SRvalue"),
    SSvalue = document.getElementById("SSvalue"),
    Cvalue = document.getElementById("Cvalue"),
    UVvalue = document.getElementById("UVvalue"),
    Pvalue = document.getElementById("Pvalue"),
    Forecast = document.querySelector(".forecast");

const API_KEY = "YOUR_API_KEY"; 

const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?appid=${API_KEY}&exclude=minutely&units=metric&`;

function findUserLocation() {
    Forecast.innerHTML = "";

    if (!userLocation.value) {
        alert("Please enter a city name.");
        return;
    }

    fetch(WEATHER_API_ENDPOINT + userLocation.value)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.coord) {
                alert("Invalid location. Please enter a valid city.");
                return;
            }

            city.innerHTML = `${data.name}, ${data.sys.country}`;
            weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png) no-repeat center`;
            weatherIcon.style.backgroundSize = "contain";

            fetch(`${WEATHER_DATA_ENDPOINT}lon=${data.coord.lon}&lat=${data.coord.lat}`)
                .then(response => response.json())
                .then(weatherData => {
                    if (!weatherData || !weatherData.current) {
                        alert("Weather data unavailable.");
                        return;
                    }

                    temperature.innerHTML = TempConverter(weatherData.current.temp);
                    feelsLike.innerHTML = `Feels Like: ${TempConverter(weatherData.current.feels_like)}`;
                    description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> ${weatherData.current.weather[0].description}`;
                    
                    const options = { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true };
                    date.innerHTML = getFormattedDate(weatherData.current.dt, weatherData.timezone_offset, options);

                    Hvalue.innerHTML = `${Math.round(weatherData.current.humidity)}<span>%</span>`;
                    Wvalue.innerHTML = `${Math.round(weatherData.current.wind_speed)}<span> m/s</span>`;
                    
                    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
                    SRvalue.innerHTML = getFormattedDate(weatherData.current.sunrise, weatherData.timezone_offset, timeOptions);
                    SSvalue.innerHTML = getFormattedDate(weatherData.current.sunset, weatherData.timezone_offset, timeOptions);

                    Cvalue.innerHTML = `${weatherData.current.clouds}<span>%</span>`;
                    UVvalue.innerHTML = weatherData.current.uvi;
                    Pvalue.innerHTML = `${weatherData.current.pressure}<span> hPa</span>`;

                    Forecast.innerHTML = "";
                    weatherData.daily.forEach(day => {
                        let forecastDiv = document.createElement("div");
                        const forecastDate = getFormattedDate(day.dt, 0, { weekday: 'long', month: 'long', day: 'numeric' });

                        forecastDiv.innerHTML = `
                            <p>${forecastDate}</p>
                            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                            <p class="forecast-desc">${day.weather[0].description}</p>
                            <span><span>${TempConverter(day.temp.min)}</span>&nbsp;&nbsp;<span>${TempConverter(day.temp.max)}</span></span>
                        `;
                        Forecast.appendChild(forecastDiv);
                    });
                })
                .catch(error => {
                    console.error("Error fetching weather data:", error);
                    alert("Error fetching detailed weather data.");
                });
        })
        .catch(error => {
            console.error("Error fetching location:", error);
            alert("Could not fetch weather data. Please check the city name and try again.");
        });
}

function getFormattedDate(dtValue, offset, options = {}) {
    const date = new Date((dtValue + offset) * 1000);
    return date.toLocaleString("en-US", { timeZone: "UTC", ...options });
}

function TempConverter(temp) {
    let tempValue = Math.round(temp);
    return converter.value === "°F"
        ? `${Math.round((tempValue * 9) / 5 + 32)}<span>°F</span>`
        : `${tempValue}<span>°C</span>`;
}
