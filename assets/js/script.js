var apiKey = "2d9b25ee134843d01ae430cf350f205b";

var today = dayjs().format('dddd, MM/DD/YYYY')

var searchCityName = document.getElementById("searchCity");
var searchHistory = document.getElementById("searchHistory")
var currentDay = document.getElementById("selectedCity")
var fiveDays = document.getElementById("fiveDays")

var onFormSubmit = function(event) {

    event.preventDefault();

    console.log("click")
}

// Get data for user identified city
var getCityInfo = function(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(queryURL).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                var latitude = data.coord.lat;
                var longitude = date.coord.lon;
                getWeather(latitude, longitude)
            })
        } else {
            alert("Couldn't find city. Try again")
        }
    })
}
// Get weather data based on city user selected
var getWeatherInfo = function(latitude, longitude) {

    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + apiKey;

    fetch(queryURL).then(function(response){
        if (response.ok){
            response.json().then(function(data){
                console.log(data);
            })
        }
        else{
            alert("Couldn't find city. Try again")
        }
    })
}

// Event Listeners
searchCityName.addEventListener("submit", onFormSubmit);



