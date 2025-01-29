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
    Forecast = document.querySelector(".forecast")

WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=6a61b10760059c3039523ce0846bb322&q=`;
WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?appid=6a61b10760059c3039523ce0846bb322&exclude=minutely&units=metric&`;

function findUserLocation() {
    fetch(WEATHER_API_ENDPOINT + userLocation.value).then((response) => response.json()).then((data) => {
        if(data.cod != '' && data.cod != 200){
            alert(data.message);
            return;
        }
        console.log(data);
        city.innerHTML = data.name + ", " + data.sys.country;
        weatherIcon.style.background=`url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`
        fetch(WEATHER_DATA_ENDPOINT+`lon=${data.coord.lon}&lat=${data.coord.lat}`).then((response) => response.json()).then((data) => {
            console.log(data);
            temperature.innerHTML = data.current.temp;
            feelsLike.innerHTML = "Feels Like" + data.current.feels_like;
            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;` + data.current.weather[0].description;
            const options = {
                weekday:"long",
                month:"long",
                day:"numeric",
                hour:"numeric",
                minute:"numeric",
                hour12:true,
            }
            date.innerHTML = getLongFormatDateTime(data.current.dt, data.timezone_offset, options);
            Hvalue.innerHTML = Math.round(data.current.humidity) + "<span>%</span>";
            Wvalue.innerHTML = Math.round(data.current.wind_speed) + "<span>%</span>";
            const options1 = {
                hour:"numeric",
                minute:"numeric",
                hour12: true,
            };
            SRvalue.innerHTML = getLongFormatDateTime(data.current.sunrise, data.timezone_offset, options1);
            SSvalue.innerHTML = getLongFormatDateTime(data.current.sunset, data.timezone_offset, options1);
            Cvalue.innerHTML = data.current.clouds + "<span>%</span>";
            UVvalue.innerHTML = data.current.uvi;
            Pvalue.innerHTML = data.current.pressure + "<span>hPa</span>";
        })
    });
}

function formatUnixTime(dtValue, offset, options={}){
    const date = new Date((dtValue + offset)*1000);
    return date.toLocateTimeString([], {timeZone: "UTC", ...options});
}

function getLongFormatDateTime(dtValue,offset,options) {
    return formatUnixTime(dtValue,offset,options);
}