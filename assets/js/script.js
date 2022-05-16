// Global Variables
var apiKey = "2d9b25ee134843d01ae430cf350f205b";
var today = moment().format("L");

var citySearched = $("#searchCity");
var searchHistory = [];


// Function for getting city data from API
var getCityInfo = function(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(queryURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                    // Display weatherInfo data
                    $("#weatherInfo").css("display", "block");
                    $("#cityInfo").empty();
                    
                    var icon = data.weather[0].icon;
                    var iconLink = "https://openweathermap.org/img/w/" + icon + ".png";
            
                    var currentCity = $(`
                        <h2 id="currentCity">
                            ${data.name} ${today} <img src="${iconLink}" alt="${data.weather[0].description}" />
                        </h2>
                        <p>Temperature: ${data.main.temp} °F</p>
                        <p>Humidity: ${data.main.humidity}\%</p>
                        <p>Wind Speed: ${data.wind.speed} MPH</p>
                    `);
            
                    $("#cityInfo").append(currentCity);
            
                    // Get UV Index
                    var latitude = data.coord.lat;
                    var longitude = data.coord.lon;
                    // Call getWeatherInfo
                    getWeatherInfo(latitude, longitude)

                });
            } else {
                alert("Couldn't find city. Try again");
            }
    
    });
}

var getWeatherInfo = function(latitude, longitude) {

    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;

    fetch(queryURL).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {

            var uvI = data.daily[0].uvi;
            var uvIndexEl = $(`
                <p>UV Index: 
                    <span id="uvIColor" class="px-2 py-2 rounded">${uvI}</span>
                </p>
            `);

            $("#cityInfo").append(uvIndexEl);

            // Call 5 day forecast
            forecast(latitude, longitude);

            if (uvI >= 0 && uvI <= 2) {
                $("#uvIColor").css("background-color", "#3EA72D").css("color", "white");
            } else if (uvI >= 3 && uvI <= 5) {
                $("#uvIColor").css("background-color", "#FFF300");
            } else if (uvI >= 6 && uvI <= 7) {
                $("#uvIColor").css("background-color", "#F18B00");
            } else if (uvI >= 8 && uvI <= 10) {
                $("#uvIColor").css("background-color", "#E53210").css("color", "white");
            } else {
                $("#uvIColor").css("background-color", "#B567A4").css("color", "white"); 
            };  
        }
    )} else{
            alert("Couldn't find city. Try again");
        }
    })
}

// TODO: Declare function to get 5 day forecast
var forecast = function(latitude, longitude) {

    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=current,minutely,hourly,alerts&appid=" + apiKey

    fetch(queryURL).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                $("#fiveDayForecast").empty();
        
                for (let i = 1; i < 6; i++) {
                    var cityInfo = {
                        date: data.daily[i].dt,
                        icon: data.daily[i].weather[0].icon,
                        temp: data.daily[i].temp.day,
                        humidity: data.daily[i].humidity
                    };
        
                    var nextDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
                    var iconLink = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${data.daily[i].weather[0].main}" />`;
        
                    var forecastCard = $(`
                        <div class="pl-3">
                            <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                                <div class="card-body">
                                    <h5>${nextDate}</h5>
                                    <p>${iconLink}</p>
                                    <p>Temp: ${cityInfo.temp} °F</p>
                                    <p>Humidity: ${cityInfo.humidity}\%</p>
                                </div>
                            </div>
                        <div>
                    `);
                    $("#fiveDayForecast").append(forecastCard);
                }
            
            }
        )};
        
    }); 
}

// Event Listeners and localStorage
$("#searchButton").on("click", function(event) {
    event.preventDefault();

    var city = citySearched.val().trim();
    getCityInfo(city);
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        var searchedCity = $(`
            <li class="list-group-item text-dark text-center m-2">${city}</li>
            `);
        $("#searchHistory").append(searchedCity);
    };
    
    localStorage.setItem("city", JSON.stringify(searchHistory));
    console.log(searchHistory);;
});

$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    getCityInfo(listCity);
});

$(document).ready(function() {
    var searchHistory = JSON.parse(localStorage.getItem("city"));

    if (searchHistory !== null) {
        var lastSearched = searchHistory.length - 1;
        var searchedCity = searchHistory[lastSearched];
        getCityInfo(searchedCity);
    }
});


