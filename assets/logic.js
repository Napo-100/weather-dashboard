var searchInput = document.querySelector("#search-input")
var findCity = document.querySelector("#search-btn")
var listItemE1 = document.querySelector(".list-group")
var cityCard = document.querySelector("#city-container")
var saveCity = JSON.parse(localStorage.getItem(".list-group")) || [];


$(document).ready(function () {

    var getWeatherInfo = function (city) {

        // format the github api url
        var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=f28282748979d8ef4250a43282c46535";

        // make a repo request to the url
        fetch(apiUrl).then(function (repsonse) {
            repsonse.json().then(function (data) {
                var latitude = data.city.coord.lat
                var longitude = data.city.coord.lon
                return fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=f28282748979d8ef4250a43282c46535").then(function (uvResponse) {
                    uvResponse.json().then(function (uvData) {
                        displayWeather(data, city, uvData);
                        var capitalize = document.querySelector(".bold-city");
                        capitalize.classList.add("capitalize");
                        console.log(data, uvData)
                    })
                })
            });
        });
    };



    var searchHandler = function (event) {
        event.preventDefault();
        // get value from input element
        var searchInput = document.querySelector("#search-input")
        var city = searchInput.value.trim();
        saveCity[saveCity.length] = city;
        clickCity(city);

        cityHistory(city);
        searchInput.value = "";
        localStorage.setItem(".list-group", JSON.stringify(saveCity));
        var capitalizeList = document.querySelector(".list-group-item");
        console.log(capitalizeList)
        capitalizeList.classList.add("capitalize");
    }

    


    var displayWeather = function (data, city, uvData) {

        // clear content
        document.querySelector(".weather-data").textContent = "";
        document.querySelector(".card-deck").innerHTML = "";
        var conditions = data.list[0];
        console.log(conditions)
        var currentTemp = data.list[0].main.temp;
        console.log(currentTemp)
        var currentHumid = data.list[0].main.humidity;
        console.log(currentHumid)
        var currentWind = data.list[0].wind.speed;
        console.log(currentWind)
        var currentUv = uvData.value;
        console.log(currentUv)

        var currentDate = moment().format("M/D/YYYY")

        var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png' />"

        var cityLocation = document.createElement("h2")
        cityLocation.classList = "bold-city"
        cityLocation.innerHTML = city + ": " + currentDate + iconDisplay



        // temperature
        var cityTemp = document.querySelector(".weather-data")
        var showConditions = document.createElement("h5")
        showConditions.classList = "temp"
        showConditions.innerHTML = "<h3> Temprature: " + currentTemp + "</h3>";

        //  humidity
        var showHumidity = document.createElement("h5")
        showHumidity.classList = "humid"
        showHumidity.innerHTML = "<h3> Humidity: " + currentHumid + "% </h3>";

        // wind
        var showWind = document.createElement("h5")
        showWind.classList = "wind"
        showWind.innerHTML = "<h3> Wind Speed: " + currentWind + " MPH <h3>";

        //uv index
        var uvIndex = document.createElement("h5")
        uvIndex.classList = "uvi"
        uvIndex.innerHTML = "<h3> UV Index: <span id='uvDanger'>" + currentUv + "</span></h3>"


        cityTemp.appendChild(cityLocation)
        cityTemp.appendChild(showConditions)
        cityTemp.appendChild(showHumidity)
        cityTemp.appendChild(showWind)
        cityTemp.appendChild(uvIndex)

        if (currentUv >= 8.6) {
            $('#uvDanger').addClass('severe')
        } else if (currentUv >= 4 && currentUv < 8.6) {
            $('#uvDanger').addClass('moderate')
        } else {
            $('#uvDanger').addClass('favorable')
        }


        var forecastEl = document.getElementById("five-day")
        forecastEl.innerHTML = "<h2>Five Day Forecast:</h2>"

        //  Five day forecast
        var cardDeck = document.querySelector(".card-deck")


        for (var i = 0; i < data.list.length; i += 8) {
            var fiveDay = (data.list[i])
            var dayDate = moment.unix(fiveDay.dt).format("M/D/YYYY")
            var card = document.createElement("div")
            card.classList = "card bg-primary"
            var cardBody = document.createElement("div")
            cardBody.classList = "card-body"
            var dateDisplay = "<p>" + dayDate + "</p>"
            var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + fiveDay.weather[0].icon + "@2x.png' />"
            console.log(iconDisplay)
            var tempDisplay = "<p> Temp: " + Math.floor(fiveDay.main.temp) + "</p>"
            var humidityDisplay = "<p> Humidity: " + fiveDay.main.humidity + "</p>"
            cardBody.innerHTML = dateDisplay + iconDisplay + tempDisplay + humidityDisplay
            card.appendChild(cardBody)
            cardDeck.appendChild(card)


        }
    }

    var clickCity = function (city) {

        if (city) {
            getWeatherInfo(city);
            searchInput.value = "";
        } else {
            alert("Please select a City")
            //to stop from creating empty card if no city is entered
            cityCard.prepend(historyList)
        }

    }

    var cityHistory = function (showCity) {

        // create list item for each city
        var historyList = document.createElement("li")
        historyList.classList = "list-group-item"
        historyList.textContent = showCity + "";
        historyList.setAttribute("style", "cursor:pointer")
        cityCard.prepend(historyList)

    }


    findCity.addEventListener("click", searchHandler);
    //Enter key while in search box will activate search
    searchInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            searchHandler(event)
        }

    });
    listItemE1.addEventListener("click", function (e) {
        clickCity(e.target.innerText)
    })
})

window.addEventListener("load", function() {
    var cityHisList = document.getElementById("city-container")
    console.log(cityHisList)
    for (i = 0; i < saveCity.length; i++) {
        var cityHis = document.createElement("li");
        
        cityHis.classList.add("list-group-item");
        cityHis.classList.add("capitalize");
        cityHis.innerHTML = saveCity[i];
        cityHisList.appendChild(cityHis)
        
    }

    // clears local storage 
    localStorage.clear();
});