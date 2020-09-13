var searchInput = document.querySelector("#search-input")
var findCity = document.querySelector("#search-btn")
var listItemE1 = document.querySelector(".list-group")
var cityCard = document.querySelector("#city-container")

$(document).ready(function() {

var getWeatherInfo = function(city) {

    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=f28282748979d8ef4250a43282c46535";

    // make a repo request to the url
    fetch(apiUrl).then(function(repsonse) {
        repsonse.json().then(function(data) {
            var latitude = data.city.coord.lat
            var longitude = data.city.coord.lon
            return fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=f28282748979d8ef4250a43282c46535").then(function(uvResponse) {
                uvResponse.json().then(function(uvData) {
                    displayWeather(data, city, uvData);
                    console.log(data, uvData)
                })
            })
        });
    });
};



var searchHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var searchInput = document.querySelector("#search-input")
    var city = searchInput.value.trim();
    console.log(city)
    clickCity(city);
    cityHistory(city);
    getWeatherInfo(city);
    searchInput.value = "";
}





var clickCity = function(city) {

    if (city) {
        getWeatherInfo(city);
        searchInput.value = "";
    } else {
        alert("Please select a City") 
        //to stop from creating empty card if no city is entered
        cityCard.prepend(historyList)
    }
    
}

var cityHistory = function(showCity) {


    // create list item for each city
    var historyList = document.createElement("li")
    historyList.classList = "list-group-item"
    historyList.textContent = showCity + "";
    historyList.setAttribute("style", "cursor:pointer")
    cityCard.prepend(historyList)
    
}





findCity.addEventListener("click", searchHandler);
//Enter key while in search box will activate search
searchInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        searchHandler(event)
    }
    
});
listItemE1.addEventListener("click", function(e) {
    clickCity(e.target.innerText)
})
})