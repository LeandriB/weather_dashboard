// Global Variables
var apiKey = "2d9b25ee134843d01ae430cf350f205b";
var today = dayjs().format('MM/DD/YYYY')

var citySearched = $("#searchCity");
var searchHistoryList = [];


// function for current condition
var getCityInfo = function(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(queryURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                    console.log(response);
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
                console.log(response);

            var uvI = data.daily[0].uvi;
            var uvIndexEl = $(`
                <p>UV Index: 
                    <span id="uvIColor" class="px-2 py-2 rounded">${uvI}</span>
                </p>
            `);

            $("#cityInfo").append(uvIndexEl);

            // TODO: Call 5 day forecast
            // forecast(latitude, longitude);

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


// Event Listeners 
$("#searchButton").on("click", function(event) {
    event.preventDefault();

    var city = citySearched.val().trim();
    getCityInfo(city);
});



