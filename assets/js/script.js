var apiKey = "2d9b25ee134843d01ae430cf350f205b";

var today = dayjs().format('dddd, MM/DD/YYYY')

var searchCityName = document.getElementById("searchCity");
var searchHistory = document.getElementById("searchHistory")
var currentDay = document.getElementById("selectedCity")
var fiveDays = document.getElementById("fiveDays")


var getCityInfo = function(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(queryURL).then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                // TODO: Call function here to retrieve weather data for specific city
            })
        } else {
            alert("Couldn't find city. Try again")
        }
    })
}



